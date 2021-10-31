// lodash: biblioteca de métodos utilitários que trazem mais facilidade para trabalhar com JS
// ao se trabalhar com lodash no front-end, convém importar somente o método que tem interesse em usar ***
import find from 'lodash/find';
import remove from 'lodash/remove';
// utilizaremos essa biblioteca para lidar com a falta de precisão do JS em operações financeiras, e ela também fornece alguns métodos úteis para operações básicas de matemática, dentre outros..
import Dinero from 'dinero.js';

const calculatePercentageDiscount = (amount, item) => {
  if (
    // o ? é um recurso chamado: Optional chaining operator
    // basicamente, se o condition existe ele lê o percentage, se não existe então para no condition
    item.condition?.percentage &&
    item.quantity > item.condition.minimum
  ) {
    return amount.percentage(item.condition.percentage);
  }
  return Money({ amount: 0 });
};

const calculateQuantityDiscount = (amount, item) => {
  const isEven = item.quantity % 2 === 0;

  if (item.condition?.quantity && item.quantity > item.condition.quantity) {
    return amount.percentage(isEven ? 50 : 40);
  }
  return Money({ amount: 0 });
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
    return this.items.reduce((accumulator, item) => {
      const amount = Money({ amount: item.quantity * item.product.price });
      let discount = Money({ amount: 0 });

      if (item.condition?.percentage) {
        discount = calculatePercentageDiscount(amount, item);
      } else if (item.condition?.quantity) {
        discount = calculateQuantityDiscount(amount, item);
      }

      return accumulator.add(amount).subtract(discount);
    }, Money({ amount: 0 }));
  }

  summary() {
    const total = this.getTotal().getAmount();
    const items = this.items;

    return {
      total,
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
