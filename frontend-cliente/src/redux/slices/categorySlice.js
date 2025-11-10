// src/redux/slices/categorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { categoryService } from "../../services/categoryService";

// ✅ Thunk para obtener todas las categorías
export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const categories = await categoryService.getAllCategories();
      return categories;
    } catch (error) {
      return rejectWithValue(error.message || "Error al cargar categorías");
    }
  }
);

// 🔹 Slice
const categorySlice = createSlice({
  name: "categories",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCategories: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCategories } = categorySlice.actions;
export default categorySlice.reducer;
