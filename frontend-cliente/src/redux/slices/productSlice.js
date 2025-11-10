// 📂 src/redux/slices/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "../../services/productService";

// 🔹 Obtener todos los productos
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const products = await productService.getAllProducts();
      return products;
    } catch (error) {
      console.error("❌ Error al obtener productos:", error);
      return rejectWithValue(error.message || "Error al cargar productos");
    }
  }
);

// 🔹 Obtener productos por categoría
export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchByCategory",
  async (categoryName, { rejectWithValue }) => {
    try {
      const products = await productService.getProductsByCategory(categoryName);
      return products;
    } catch (error) {
      console.error(`❌ Error al obtener productos de la categoría ${categoryName}:`, error);
      return rejectWithValue(error.message || "Error al cargar productos por categoría");
    }
  }
);

// 🔹 Obtener producto por ID
export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const product = await productService.getProductById(id);
      return product;
    } catch (error) {
      console.error(`❌ Error al obtener producto ${id}:`, error);
      return rejectWithValue(error.message || "Error al cargar producto");
    }
  }
);

// 🧩 Slice
const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    selectedProduct: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 fetchProductsByCategory
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 fetchProductById
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
