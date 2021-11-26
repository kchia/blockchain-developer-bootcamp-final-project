import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth/auth.slice";
import { bubblesReducer } from "../features/bubbles/bubbles.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bubbles: bubblesReducer,
  },
});
