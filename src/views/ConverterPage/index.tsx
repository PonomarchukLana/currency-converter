import React, { useState, useEffect } from "react";
import { useAppSelector } from "../../app/hooks";
import localStorageState from "../../services/localStorage";
import { ExchangeRatesObj } from "../../ts/interfaces/exchangerates.interface";
import Header from "../../components/Header";
import ExchangeRates from "../../features/exchangeRates";
import { PageContainer } from "./styles";

const ConverterPage = () => {
  const currencyStatus = useAppSelector(state => state.exchangeRatesSlice.status);
  const [data, setData] = useState<ExchangeRatesObj[] | null>(null);

  const filteredData = (arr: string | null): any => {
    if (arr) {
      const data = JSON.parse(arr || "{}");
      return data.filter(
        (i) => i?.currencyCodeA == 978 || i?.currencyCodeB == 840
      );
    }
  };

  useEffect(() => {
    if (currencyStatus == "fulfilled") {
      const filter = filteredData(localStorageState.get("currency"));
      setData(filter);
    } else if (localStorageState.get("currency") != null) {
      const filter = filteredData(localStorageState.get("currency"));
      setData(filter);
    }
  }, [currencyStatus])

  return (
    <>
      <Header data={data} />
      <PageContainer>
        <ExchangeRates />
      </PageContainer>
    </>
  );
};

export default ConverterPage;
