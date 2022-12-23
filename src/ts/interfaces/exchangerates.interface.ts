export interface ExchangeRatesObj {
  currencyCodeA: number;
  currencyCodeB: number;
  date: number;
  rateBuy?: number;
  rateSell?: number;
  rateCross?: number;
}

export interface Currencies {
  value: number;
  label: string,
}
