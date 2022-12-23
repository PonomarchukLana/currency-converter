import { configureStore } from '@reduxjs/toolkit';
import localStorageState from "../services/localStorage";
import exchangeRatesSlice from '../features/exchangeRates/exchangeRatesSlice';

const store = configureStore({
  reducer: {
    exchangeRatesSlice,
  },
});

store.subscribe(() => localStorageState.set("currency", store.getState().exchangeRatesSlice.data));

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;
