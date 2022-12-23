import { ExchangeRatesObj } from "../ts/interfaces/exchangerates.interface";

const localStorageState = {
  set(key: string, state: ExchangeRatesObj[]): void {
    if (state) {
      localStorage.setItem(key, JSON.stringify(state));
    }
  },

  get(key: string) {
    return localStorage.getItem(key);
  },

  clear() {
    localStorage.clear();
  },
};

export default localStorageState;
