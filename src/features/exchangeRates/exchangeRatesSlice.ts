import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import { ExchangeRatesObj } from "../../ts/interfaces/exchangerates.interface";

interface ExchangeRatesState {
  status: 'idle' | 'fulfilled' | 'loading';
  data: [] | ExchangeRatesObj[];
}

const initialState: ExchangeRatesState = {
  status: 'idle',
  data: [],
}

export const getExchangeRates = createAsyncThunk('currency/getRates',
  async () => {
    const response = await axios.get("https://api.monobank.ua/bank/currency")
    return response.data;
  }
);

const exchangeRatesSlice = createSlice({
    name: 'currency',
    initialState,
    reducers: {},
    extraReducers: builder => {
      builder.addCase(getExchangeRates.pending, (state) => {
        state.status = 'loading';
      });

      builder.addCase(getExchangeRates.fulfilled, (state, action) => {
        state.status = 'fulfilled';
        state.data = action.payload;
      });

      builder.addCase(getExchangeRates.rejected, (state) => {
        state.status = 'idle';
      });
    },
  })
export default exchangeRatesSlice.reducer;
