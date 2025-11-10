// 📂 src/redux/slices/productDetailSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "../../services/productService";
import { reviewService } from "../../services/reviewService";

// 🔹 Obtener detalle completo del producto (producto + imágenes + reviews + estadísticas)
export const fetchProductDetail = createAsyncThunk(
  "productDetail/fetch",
  async (id, { rejectWithValue }) => {
    try {
      const [product, images, reviewsRaw, stats] = await Promise.all([
        productService.getProductById(id),
        productService.getProductImages(id),
        reviewService.getReviewsByProduct(id),
        reviewService.getProductReviewStats(id),
      ]);

      // Mapear reviews SOLO para el detalle de producto
      const reviews = Array.isArray(reviewsRaw)
        ? reviewsRaw.map(r => ({
            id: r.id,
            rating: r.puntuacion,
            comment: r.comentario || '',
            date: r.fechaCreacion,
            userId: r.usuarioId,
            productId: r.productoId,
            reservationId: r.reservaId,
            usuarioNombre: r.usuarioNombre || ''
          }))
        : [];

      return { product, images, reviews, stats };
    } catch (error) {
      console.error("❌ Error al obtener detalle de producto:", error);
      return rejectWithValue(error.message || "Error al cargar detalle del producto");
    }
  }
);

const productDetailSlice = createSlice({
  name: "productDetail",
  initialState: {
    product: null,
    images: [],
    reviews: [],
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearProductDetail: (state) => {
      state.product = null;
      state.images = [];
      state.reviews = [];
      state.stats = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
        state.images = action.payload.images;
        state.reviews = action.payload.reviews;
        state.stats = action.payload.stats;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProductDetail } = productDetailSlice.actions;
export default productDetailSlice.reducer;
