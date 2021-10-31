// lodash: biblioteca de métodos utilitários que trazem mais facilidade para trabalhar com JS
// ao se trabalhar com lodash no front-end, convém importar somente o método que tem interesse em usar ***
import find from 'lodash/find';
import remove from 'lodash/remove';
// utilizaremos essa biblioteca para lidar com a falta de precisão do JS em operações financeiras, e ela também fornece alguns métodos úteis para operações básicas de matemática, dentre outros..
import Dinero from 'dinero.js';

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
  const isEven = quantity % 2 === 0;

  if (condition?.quantity && quantity > condition.quantity) {
    return amount.percentage(isEven ? 50 : 40);
  }
  return Money({ amount: 0 });
};

const calculateDiscount = (amount, quantity, condition) => {
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

const Money = Dinero;

Money.defaultCurrency = 'BRL';
Money.defaultPrecision = 2;

export default class Cart {
  items = [];

  add(item) {
    const itemToFind = { product: item.product };

    if (find(this.items, itemToFind)) {
      remove(this.items, itemToFind);
    }

    this.items.push(item);
  }

  remove(product) {
    remove(this.items, { product });
  }

  getTotal() {
    return this.items.reduce(
      (accumulator, { condition, quantity, product }) => {
        const amount = Money({ amount: quantity * product.price });
        let discount = Money({ amount: 0 });

        if (condition) {
          discount = calculateDiscount(amount, quantity, condition);
        }

        return accumulator.add(amount).subtract(discount);
      },
      Money({ amount: 0 }),
    );
  }

  summary() {
    const total = this.getTotal();
    const formatted = total.toFormat('$0,0.00');
    const items = this.items;

    return {
      total: total.getAmount(),
      formatted,
      items,
    };
  }

  checkout() {
    const { total, items } = this.summary();

    this.items = [];

    return {
      total,
      items,
    };
  }
}
