import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import CurrencyField from "../../components/CurrencyField";
import Header from "../../components/Header";
import { PageContainer } from "./styles.js";

const currencies = [
  {
    value: 840,
    label: "USD",
  },
  {
    value: 978,
    label: "EUR",
  },
  {
    value: 980,
    label: "UAH",
  },
];

const ConverterPage = () => {
  const [currencyResponse, setCurrencyResponse] = useState([]);
  const [leftField, setLeftField] = useState({
    amount: 1,
    currency: 840,
    startedFrom: false,
  });
  const [rightField, setRightField] = useState({
    amount: 1,
    currency: 980,
    startedFrom: false,
  });
  const [currentCurrency, setCurrentCurrency] = useState(null);
  const headerData =
    currencyResponse?.filter(
      (i) =>
        (i.currencyCodeA == 840 || i.currencyCodeA == 978) &&
        i.currencyCodeB == 980
    ) || null;

  const updateCurrentCurrency = (data, leftField, rightField) => {
    const currentCurrencyObj =
      data.find(
        (i) =>
          (i.currencyCodeA == leftField || i.currencyCodeA == rightField) &&
          (i.currencyCodeB == leftField || i.currencyCodeB == rightField)
      ) || null;
    return currentCurrencyObj;
  };

  useEffect(() => {
    if (localStorage.getItem("currency") === null) {
      axios
        .get("https://api.monobank.ua/bank/currency")
        .then((response) => {
          localStorage.setItem(
            "currency",
            // USD 840 / EUR 978 / UAH	980
            JSON.stringify(
              response.data.filter(
                (i) => i.currencyCodeA == 840 || i.currencyCodeA == 978
              )
            )
          );
          setCurrencyResponse(JSON.parse(localStorage.getItem("currency")));
          setCurrentCurrency(
            updateCurrentCurrency(
              JSON.parse(localStorage.getItem("currency")),
              leftField.currency,
              rightField.currency
            )
          );
          setRightField((rightField) => ({
            ...rightField,
            amount: updateCurrentCurrency(
              JSON.parse(localStorage.getItem("currency")),
              leftField.currency,
              rightField.currency
            ).rateBuy,
          }));
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setCurrencyResponse(JSON.parse(localStorage.getItem("currency")));
      setCurrentCurrency(
        updateCurrentCurrency(
          JSON.parse(localStorage.getItem("currency")),
          leftField.currency,
          rightField.currency
        )
      );

      setRightField((rightField) => ({
        ...rightField,
        amount: updateCurrentCurrency(
          JSON.parse(localStorage.getItem("currency")),
          leftField.currency,
          rightField.currency
        ).rateBuy,
      }));
    }
  }, []);

  useEffect(() => {
    if (currentCurrency) {
      if (leftField.startedFrom) {
        if (leftField.currency == currentCurrency.currencyCodeA) {
          setRightField((rightField) => ({
            ...rightField,
            amount: leftField.amount * currentCurrency?.rateBuy,
            startedFrom: false,
          }));
        } else if (leftField.currency == currentCurrency.currencyCodeB) {
          setRightField((rightField) => ({
            ...rightField,
            amount: leftField.amount / currentCurrency?.rateSell,
          }));
        }
      } else if (rightField.startedFrom) {
        if (rightField.currency == currentCurrency.currencyCodeB) {
          setLeftField((leftField) => ({
            ...leftField,
            amount: rightField.amount / currentCurrency?.rateBuy,
            startedFrom: false,
          }));
        } else if (rightField.currency == currentCurrency.currencyCodeA) {
          setLeftField((leftField) => ({
            ...leftField,
            amount: rightField.amount * currentCurrency?.rateSell,
          }));
        }
      } else {
        if (leftField.currency == currentCurrency.currencyCodeA) {
          setRightField((rightField) => ({
            ...rightField,
            amount: leftField.amount * currentCurrency?.rateBuy,
          }));
        } else if (leftField.currency == currentCurrency.currencyCodeB) {
          setRightField((rightField) => ({
            ...rightField,
            amount: leftField.amount / currentCurrency?.rateSell,
          }));
        }
      }
    }

    if (!currentCurrency) {
      if (rightField.startedFrom) {
        setLeftField((leftField) => ({
          ...leftField,
          amount: rightField.amount,
        }));
      } else {
        setRightField((rightField) => ({
          ...rightField,
          amount: leftField.amount,
        }));
      }
    }
  }, [currentCurrency]);

  const handleGetAmountLeft = (value) => {
    setLeftField((leftField) => ({
      ...leftField,
      amount: +value,
      startedFrom: true,
    }));
    if (leftField.currency == currentCurrency.currencyCodeA) {
      setRightField((rightField) => ({
        ...rightField,
        amount: value * currentCurrency?.rateBuy,
        startedFrom: false,
      }));
    } else if (leftField.currency == currentCurrency.currencyCodeB) {
      setRightField((rightField) => ({
        ...rightField,
        amount: value / currentCurrency?.rateSell,
      }));
    }
  };

  const handleGetAmountRight = (value) => {
    setRightField((rightField) => ({
      ...rightField,
      amount: +value,
      startedFrom: true,
    }));
    if (rightField.currency == currentCurrency.currencyCodeB) {
      setLeftField((leftField) => ({
        ...leftField,
        amount: value / currentCurrency?.rateBuy,
        startedFrom: false,
      }));
    } else if (rightField.currency == currentCurrency.currencyCodeA) {
      setLeftField((leftField) => ({
        ...leftField,
        amount: value * currentCurrency?.rateSell,
      }));
    }
  };

  const handleGetCurrencyLeft = (value) => {
    setLeftField((leftField) => ({ ...leftField, currency: value }));
    setCurrentCurrency(
      updateCurrentCurrency(currencyResponse, value, rightField.currency)
    );
  };

  const handleGetCurrencyRight = (value) => {
    setRightField((rightField) => ({ ...rightField, currency: value }));
    setCurrentCurrency(
      updateCurrentCurrency(currencyResponse, leftField.currency, value)
    );
  };

  return (
    <>
      <Header data={headerData} />
      <PageContainer>
        <Box
          sx={{
            m: 1,
            width: "fit-content",
            height: "fit-content",
          }}
        >
          <Paper elevation={3}>
            <CurrencyField
              label={"I have"}
              currencies={currencies}
              getAmount={handleGetAmountLeft}
              getCurrency={handleGetCurrencyLeft}
              recalculatedAmount={leftField.amount}
              defaultCurrencies={leftField.currency}
              active={leftField.startedFrom}
            />
            <CurrencyField
              label={"I will get"}
              currencies={currencies}
              getAmount={handleGetAmountRight}
              getCurrency={handleGetCurrencyRight}
              recalculatedAmount={rightField.amount}
              defaultCurrencies={rightField.currency}
              active={rightField.startedFrom}
            />
          </Paper>
        </Box>
      </PageContainer>
    </>
  );
};

export default ConverterPage;
