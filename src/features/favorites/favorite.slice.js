import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { STATUS } from "../../common/constants";
import { create } from "./favorites.service.js";

const createNewFavorite = createAsyncThunk(
  "favorites/favoriteCreated",
  (data, { getState }) => {
    const { createStatus } = getState().favorite;
    if (createStatus !== STATUS.loading) return;
    return create(data);
  }
);

const initialState = {
  favorite: {},
  createStatus: STATUS.idle,
  error: null,
};

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    favoriteSelected: {
      reducer(state, { payload }) {
        state.favorite = payload;
      },
      prepare({ originalAssetId, name, imageUrl, type, assetContractAddress }) {
        return {
          payload: {
            originalAssetId,
            name,
            imageUrl,
            type,
            assetContractAddress,
          },
        };
      },
    },
  },
  extraReducers(builder) {
    builder
      .addCase(createNewFavorite.pending, (state, action) => {
        if (state.createStatus === STATUS.idle) {
          state.createStatus = STATUS.loading;
        }
      })
      .addCase(createNewFavorite.fulfilled, (state, { payload }) => {
        if (state.createStatus === STATUS.loading) {
          state.createStatus = STATUS.idle;
        }
      })
      .addCase(createNewFavorite.rejected, (state, error) => {
        if (state.createStatus === STATUS.loading) {
          state.createStatus = STATUS.idle;
          state.error = error;
        }
      });
  },
});

const selectFavorite = ({ favorite: { favorite } }) => favorite;
const selectCreateStatus = ({ favorite: { createStatus } }) => createStatus;
const { reducer: favoriteReducer } = favoriteSlice;
const { favoriteSelected } = favoriteSlice.actions;

export {
  createNewFavorite,
  favoriteReducer,
  favoriteSelected,
  selectCreateStatus,
  selectFavorite,
};
