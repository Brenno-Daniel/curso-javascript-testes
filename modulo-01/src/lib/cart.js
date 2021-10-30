export default class Cart {
  items = [];

  add(item) {
    this.items.push(item);
  }

  getTotal() {
    return this.items.reduce((accumulator, item) => {
      return accumulator + item.quantity * item.product.price;
    }, 0);
  }
}
