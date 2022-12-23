import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Currencies } from "../../ts/interfaces/exchangerates.interface";

type Props = {
  label: string;
  currencies: Currencies[];
  getAmount: (val: string) => void;
  getCurrency: (val: string) => void;
  recalculatedAmount: number;
  defaultCurrencies: number | string;
  active: boolean;
}

const CurrencyField = ({
  label,
  currencies,
  getAmount,
  getCurrency,
  recalculatedAmount,
  defaultCurrencies,
  active,
}: Props) => {
  const [amount, setAmount] = useState<number | string>(0);
  const [onFocusField, setOnFocusField] = useState<boolean>(false);

  useEffect(() => {
    if (recalculatedAmount) {
      setAmount(recalculatedAmount);
    }
  }, [recalculatedAmount]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onFocusField) {
      setAmount(e.target.value);
      getAmount(e.target.value);
    }
  };

  const handleСurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    getCurrency(e.target.value);
  };

  const invalidChars = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const chars = ["-", "e", "+", "E"];
    if (chars.includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div>
      <FormControl sx={{ m: 1 }} variant="standard">
        <TextField
          type="number"
          label={label}
          color="success"
          focused={active}
          autoComplete="off"
          onChange={handleAmountChange}
          value={amount}
          onKeyDown={(e) => invalidChars(e)}
          onFocus={() => setOnFocusField(true)}
          onBlur={() => {
            setOnFocusField(false);
          }}
        />
      </FormControl>
      <FormControl sx={{ m: 1 }} variant="standard">
        <TextField
          select
          color="success"
          focused={active}
          value={defaultCurrencies}
          onChange={handleСurrencyChange}
        >
          {currencies.map((option, index) => (
            <MenuItem key={`${option.value}` + `${index}`} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </FormControl>
    </div>
  );
};

export default CurrencyField;
