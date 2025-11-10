import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { reviewService } from "../../services/reviewService";

// ✅ Thunks para llamadas asincrónicas al backend
export const fetchReviewsByProduct = createAsyncThunk(
  "reviews/fetchByProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const reviews = await reviewService.getFormattedReviewsByProduct(productId);
      return reviews;
    } catch (error) {
      return rejectWithValue(error.message || "Error al cargar reseñas");
    }
  }
);

export const addReview = createAsyncThunk(
  "reviews/addReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await reviewService.createReview(reviewData);
      // Mapear al formato frontend para mantener consistencia
      return reviewService.mapBackendReviewToFrontend(response);
    } catch (error) {
      return rejectWithValue(error.message || "Error al agregar reseña");
    }
  }
);

// 🔹 Slice
const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    clearReviews: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchReviewsByProduct
      .addCase(fetchReviewsByProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewsByProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchReviewsByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // addReview
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        // Insertar al principio
        state.items.unshift(action.payload);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
