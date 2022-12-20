import React from "react";
import { HeaderWrapper, Logo, CurrencyWrapper } from "./styles.js";

const Header = ({ data }) => {
  const currenciesValue = (code) => {
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
      <Logo onClick={() => localStorage.clear()}>currency converter</Logo>
      <CurrencyWrapper>
        {data?.map((i) => (
          <span key={`${i.currencyCodeA}`}>
            <p>
              1 {currenciesValue(i.currencyCodeA)} = {i.rateBuy} UAH
            </p>
            <p>
              1 UAH = {i.rateSell} {currenciesValue(i.currencyCodeA)}
            </p>
          </span>
        ))}
      </CurrencyWrapper>
    </HeaderWrapper>
  );
};

export default Header;
