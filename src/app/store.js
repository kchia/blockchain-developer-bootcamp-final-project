import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth/auth.slice";
import { coinsReducer } from "../features/coins/coins.slice";
import { coinReducer } from "../features/coins/coin.slice";
import { favoriteReducer } from "../features/favorites/favorite.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    coins: coinsReducer,
    coin: coinReducer,
    favorite: favoriteReducer,
  },
});
