import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useAppDispatch } from "../../app/hooks";
import { ExchangeRatesObj } from "../../ts/interfaces/exchangerates.interface";
import localStorageState from "../../services/localStorage";
import CurrencyField from "../../components/CurrencyField";
import getCurrencyAmount from "../../utils/getCurrencyAmount";
import getExistingField from "../../utils/getExistingField";
import ErrorMessage from "../../components/ErrorMessage"; 
import { getExchangeRates } from "./exchangeRatesSlice";
import { currencies } from "./currencies";

const ExchangeRates = () => {
  const [exchangeRates, setExchangeRates] = useState<ExchangeRatesObj[] | null>(null);

  const [leftField, setLeftField] = useState<number>(1);
  const [leftFieldCurrency, setLeftFieldCurrency] = useState<number | string>("");
  const [leftFieldStartedFrom, setLeftFieldStartedFrom] = useState<boolean>(false);

  const [rightField, setRightField] = useState<number>(1);
  const [rightFieldCurrency, setRightFieldCurrency] = useState<number | string>("");
  const [rightFieldStartedFrom, setRightFieldStartedFrom] = useState<boolean>(false);

  const [currentCurrency, setCurrentCurrency] = useState<ExchangeRatesObj | null>(null);
  const [showError, setShowError] = useState<boolean>(false);

  const rateBuy = getExistingField(currentCurrency?.rateBuy, currentCurrency?.rateCross);
  const rateSell = getExistingField(currentCurrency?.rateSell, currentCurrency?.rateCross);

  const isRateBuyExist = rateBuy != undefined;
  const isRateSellExist = rateSell != undefined;

  const dispatch = useAppDispatch();

  const updateCurrentCurrency = () => {
    if (exchangeRates) {
      if (leftFieldCurrency == rightFieldCurrency) {
        setCurrentCurrency(null);
      } else {
        const obj = exchangeRates.find((i) => 
              (i.currencyCodeA == leftFieldCurrency ||
                i.currencyCodeA == rightFieldCurrency) &&
              (i.currencyCodeB == leftFieldCurrency ||
                i.currencyCodeB == rightFieldCurrency)
          ) || null;

        if (obj) {
          setCurrentCurrency(obj);
        } else if (!obj) {
          setShowError(true);
        }
      }
    }
  };

  useEffect(() => {
    setShowError(false);
    updateCurrentCurrency();
}, [leftFieldCurrency, rightFieldCurrency]);

  useEffect(() => {
    if (localStorageState.get("currency") === null) {
      dispatch(getExchangeRates()).then((resp) => {
        if (resp.payload) {
          setExchangeRates(resp.payload);
          setCurrentCurrency(resp.payload[0]);
          setLeftFieldCurrency(resp.payload[0].currencyCodeA);

          setRightField(resp.payload[0].rateBuy);
          setRightFieldCurrency(resp.payload[0].currencyCodeB);
        }
      });
    } else {
      const currencyData = JSON.parse(localStorageState.get("currency") || "null");

      setExchangeRates(currencyData);
      setLeftFieldCurrency(currencyData[0].currencyCodeA)
      setRightField(currencyData[0].rateBuy);
      setRightFieldCurrency(currencyData[0].currencyCodeB);
    }
  }, []);

  useEffect(() => {
    if (currentCurrency && isRateBuyExist && isRateSellExist) {
      if (leftFieldStartedFrom) {
        if (leftFieldCurrency == currentCurrency.currencyCodeA) {
          setRightField(getCurrencyAmount.multiply(leftField, rateBuy));
          setRightFieldStartedFrom(false);
        } else if (leftFieldCurrency == currentCurrency.currencyCodeB) {
          setRightField(getCurrencyAmount.divide(leftField, rateSell))
        }
      } else if (rightFieldStartedFrom) {
        if (rightFieldCurrency == currentCurrency.currencyCodeB) {
          setLeftField(getCurrencyAmount.multiply(rightField, rateBuy));
          setLeftFieldStartedFrom(false);
        } else if (rightFieldCurrency == currentCurrency.currencyCodeA) {
          setLeftField(getCurrencyAmount.multiply(rightField, rateSell));
        }
      } else {
        if (leftFieldCurrency == currentCurrency.currencyCodeA) {
          setRightField(getCurrencyAmount.multiply(leftField, rateBuy));
        } else if (leftFieldCurrency == currentCurrency.currencyCodeB) {
          setRightField(getCurrencyAmount.divide(leftField, rateSell));
        }
      }
    }

    if (!currentCurrency) {
      if (rightFieldStartedFrom) {
        setLeftField(rightField);
      } else {
        setRightField(leftField);
      }
    }
  }, [currentCurrency]);

  const handleGetAmountLeft = (value: string) => {
    setLeftField(+value);
    setLeftFieldStartedFrom(true);

    if (currentCurrency && isRateBuyExist && isRateSellExist) {
      if (leftFieldCurrency == currentCurrency.currencyCodeA) {
        setRightField(getCurrencyAmount.multiply(+value, rateBuy));
        setRightFieldStartedFrom(false);
      } else if (leftFieldCurrency == currentCurrency.currencyCodeB) {
        setRightField(getCurrencyAmount.divide(+value, rateSell));
      }
    }
  };

  const handleGetAmountRight = (value: string) => {
    setRightField(+value);
    setRightFieldStartedFrom(true);

    if (currentCurrency && isRateBuyExist && isRateSellExist) {
      if (rightFieldCurrency == currentCurrency.currencyCodeB) {
        setLeftField(getCurrencyAmount.divide(+value, rateBuy));
        setLeftFieldStartedFrom(false);
      } else if (rightFieldCurrency == currentCurrency.currencyCodeA) {
        setLeftField(getCurrencyAmount.multiply(+value, rateSell));
      }
    }
  };

  const handleGetCurrencyLeft = (value: string) => {
    setLeftFieldCurrency(value);
  };

  const handleGetCurrencyRight = (value: string) => {
    setRightFieldCurrency(value);
  };

  return (
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
          recalculatedAmount={leftField}
          defaultCurrencies={leftFieldCurrency}
          active={leftFieldStartedFrom}
        />
        <CurrencyField
          label={"I will get"}
          currencies={currencies}
          getAmount={handleGetAmountRight}
          getCurrency={handleGetCurrencyRight}
          recalculatedAmount={rightField}
          defaultCurrencies={rightFieldCurrency}
          active={rightFieldStartedFrom}
        />
      </Paper>
      {showError && <ErrorMessage helperMessage={"One of the currency should be UAH"} />}
    </Box>
  );
};

export default ExchangeRates;
