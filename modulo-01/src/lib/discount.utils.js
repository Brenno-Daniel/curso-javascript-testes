import Dinero from 'dinero.js';

const Money = Dinero;

Money.defaultCurrency = 'BRL';
Money.defaultPrecision = 2;

const calculatePercentageDiscount = (amount, { condition, quantity }) => {
  if (
    // o ? é um recurso chamado: Optional chaining operator
    // basicamente, se o condition existe ele lê o percentage, se não existe então para no condition
    condition?.percentage &&
    quantity > condition.minimum
  ) {
    return amount.percentage(condition.percentage);
  }
  return Money({ amount: 0 });
};

const calculateQuantityDiscount = (amount, { condition, quantity }) => {
  debugger;
  const isEven = quantity % 2 === 0;

  if (condition?.quantity && quantity > condition.quantity) {
    return amount.percentage(isEven ? 50 : 40);
  }
  return Money({ amount: 0 });
};

export const calculateDiscount = (amount, quantity, condition) => {
  // se condition for um array então a lista recebe um array de condition, se não então crio novo array e passo a condition
  const list = Array.isArray(condition) ? condition : [condition];

  const [higherDiscount] = list
    .map(cond => {
      if (cond.percentage) {
        return calculatePercentageDiscount(amount, {
          condition: cond,
          quantity,
        }).getAmount();
      } else if (cond.quantity) {
        return calculateQuantityDiscount(amount, {
          condition: cond,
          quantity,
        }).getAmount();
      }
    })
    .sort((firstVal, secondVal) => secondVal - firstVal);

  return Money({ amount: higherDiscount });
};
