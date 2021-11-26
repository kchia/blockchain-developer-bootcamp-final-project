import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth/auth.slice";
import { ellipticalsReducer } from "../features/ellipticals/ellipticals.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ellipticals: ellipticalsReducer,
  },
});
