import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

const CurrencyField = ({
  label,
  currencies,
  getAmount,
  getCurrency,
  recalculatedAmount,
  defaultCurrencies,
  active,
}) => {
  const [amount, setAmount] = useState(0);
  const [onFocusField, setOnFocusField] = useState(false);

  useEffect(() => {
    if (recalculatedAmount) {
      setAmount(recalculatedAmount);
    }
  }, [recalculatedAmount]);

  const handleAmountChange = (e) => {
    if (onFocusField) {
      setAmount(e.target.value);
      getAmount(e.target.value);
    }
  };

  const handleСurrencyChange = (e) => {
    getCurrency(e.target.value);
  };

  const invalidChars = (e) => {
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
          {currencies.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </FormControl>
    </div>
  );
};

export default CurrencyField;
