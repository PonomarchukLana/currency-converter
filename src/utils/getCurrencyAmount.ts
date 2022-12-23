const getCurrencyAmount = {
  multiply(amount: number, rate: number): number {
    return amount * rate;
  },

  divide(amount: number, rate: number): number {
    return amount / rate;
  },
};

export default getCurrencyAmount;
