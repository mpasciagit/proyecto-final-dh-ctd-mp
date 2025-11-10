import { createSlice } from "@reduxjs/toolkit";

/* === Persistencia local === */
const savedState = JSON.parse(localStorage.getItem("reservationState") || "null");

/* === Estado inicial === */
const initialState =
  savedState || {
    selectedCategory: null, // id o nombre de la categoría elegida en Etapa 1
    selectedDates: {
      start: null, // fecha de retiro
      end: null,   // fecha de devolución
    },
    pickupLocation: "",   // Lugar de retiro
    dropoffLocation: "",  // Lugar de devolución
    selectedProduct: null, // Vehículo/producto elegido (Etapa 2)
  };

/* === Slice principal === */
const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    setCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    setDates(state, action) {
      state.selectedDates = action.payload;
    },
    setPickupLocation(state, action) {
      state.pickupLocation = action.payload;
    },
    setDropoffLocation(state, action) {
      state.dropoffLocation = action.payload;
    },
    setProduct(state, action) {
      state.selectedProduct = action.payload;
    },
    clearReservation(state) {
      state.selectedCategory = null;
      state.selectedDates = { start: null, end: null };
      state.pickupLocation = "";
      state.dropoffLocation = "";
      state.selectedProduct = null;
    },
  },
});

/* === Exportar acciones === */
export const {
  setCategory,
  setDates,
  setPickupLocation,
  setDropoffLocation,
  setProduct,
  clearReservation,
} = reservationSlice.actions;

/* === Reducer principal === */
export default reservationSlice.reducer;

/* === Middleware de persistencia ===
Guarda automáticamente el estado en localStorage
cada vez que cambia algo en reservation.
*/
export const persistReservation = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState().reservation;
  localStorage.setItem("reservationState", JSON.stringify(state));
  return result;
};
