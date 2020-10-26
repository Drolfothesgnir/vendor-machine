import Product from "../Product";
import { computeChange } from "../utulities";
import RowSelected from "./RowSelectedState";
import VM_Events from "./vmEvents";

export default class ColumnSelected extends RowSelected {
  selectPosition() {}

  purchase() {
    const x = this.vendorMachine.posX;
    const y = this.vendorMachine.posY;
    const product = this.vendorMachine.grid[y][x];
    if (!product) {
      this.cancelPositionSelection();
      this.vendorMachine.notifier.notify(VM_Events.EMPTY_PLACE_SELECTED, y, x);
      return;
    }
    if (product.price > this.vendorMachine.insertedCoinsValue) {
      this.cancelPositionSelection();
      this.vendorMachine.notifier.notify(VM_Events.NOT_ENOUGH_MONEY);
      return;
    }
    const change = this.vendorMachine.insertedCoinsValue - product.price;
    product.quantity -= 1;
    if (product.quantity < 1) {
      this.vendorMachine.grid[y][x] = null;
    }

    this.vendorMachine.returnChange(
      computeChange(change, this.vendorMachine.availableCoins)
    );
    this.vendorMachine.posY = -1;
    this.vendorMachine.posX = -1;
    this.vendorMachine.insertedCoinsValue = 0;
    this.vendorMachine.insertedCoins = {};
    this.vendorMachine.productPlace.push(
      new Product(product.id, product.price, 1)
    );
    this.vendorMachine.setState(this.vendorMachine.noCoins);
    this.vendorMachine.notifier.notify(VM_Events.PURCHASED, y, x);
  }
}
