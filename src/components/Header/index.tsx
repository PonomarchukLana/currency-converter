import React from "react";
import localStorageState from "../../services/localStorage";
import { ExchangeRatesObj } from "../../ts/interfaces/exchangerates.interface";
import { HeaderWrapper, Logo, CurrencyWrapper } from "./styles";

type Props = {
  data?: ExchangeRatesObj[] | null;
};

const Header = ({ data }: Props) => {
  const currenciesValue = (code: number) => {
    switch (code) {
      case 840:
        return "USD";

      default:
      case 978:
        return "EUR";
    }
  };

  return (
    <HeaderWrapper>
      <Logo onClick={() => localStorageState.clear()}>currency converter</Logo>
      <CurrencyWrapper>
        {data && data.map((item, index) => (
          <span key={`${item.currencyCodeA}` + `${index}`}>
            <p>
              1 {currenciesValue(item.currencyCodeA)} = {item.rateBuy} UAH
            </p>
            <p>
              1 UAH = {item.rateSell} {currenciesValue(item.currencyCodeA)}
            </p>
          </span>
        ))}
      </CurrencyWrapper>
    </HeaderWrapper>
  );
};

export default Header;
