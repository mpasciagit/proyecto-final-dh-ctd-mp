import { configureStore } from "@reduxjs/toolkit";
import reviewReducer from "./slices/reviewSlice";
import categoryReducer from "./slices/categorySlice";
import productReducer from "./slices/productSlice";
import productDetailReducer from "./slices/productDetailSlice";
import reservationReducer, {
  persistReservation,
} from "./slices/reservationSlice";

const store = configureStore({
  reducer: {
    review: reviewReducer,
    category: categoryReducer,
    products: productReducer,
    productDetail: productDetailReducer,
    reservation: reservationReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(persistReservation),
});

export default store;
