import Product from "../Product";
import { computeChange } from "../utulities";
import RowSelected from "./RowSelectedState";
import VM_Events from "./vmEvents";

/**
 * This state is active when both row and column are selected.
 * Allows to purchase, cancel position selection and cancel purchasing.
 */
export default class ColumnSelected extends RowSelected {
  // after column selected user can't select position anymore
  selectPosition() {}

  purchase() {
    const x = this.vendorMachine.posX;
    const y = this.vendorMachine.posY;
    const product = this.vendorMachine.grid[y][x];

    // if user selected empty place
    // selected row and column resets and user gets notified with invalid row and column as callback parameters
    if (!product) {
      this.cancelPositionSelection();
      this.vendorMachine.notifier.notify(VM_Events.EMPTY_PLACE_SELECTED, y, x);
      return;
    }

    // if price of product is higher than value of user-inserted coins
    // selected row and column resets and user gets notified
    if (product.price > this.vendorMachine.insertedCoinsValue) {
      this.cancelPositionSelection();
      this.vendorMachine.notifier.notify(VM_Events.NOT_ENOUGH_MONEY);
      return;
    }

    const change = this.vendorMachine.insertedCoinsValue - product.price;

    // after purchasing products quantity decrements
    // and selected place becomes empty if purchased product was last one
    product.quantity -= 1;
    if (product.quantity < 1) {
      this.vendorMachine.grid[y][x] = null;
    }

    // users change is drops to change place
    this.vendorMachine.returnChange(
      computeChange(change, this.vendorMachine.availableCoins)
    );

    // selected position and inserted money clears
    this.vendorMachine.posY = -1;
    this.vendorMachine.posX = -1;
    this.vendorMachine.insertedCoinsValue = 0;
    this.vendorMachine.insertedCoins = {};
    this.vendorMachine.productPlace.push(
      new Product(product.id, product.price, 1)
    );

    // machine state returns to initial NoCoins state
    // and user gets notified
    this.vendorMachine.setState(this.vendorMachine.noCoins);
    this.vendorMachine.notifier.notify(VM_Events.PURCHASED, y, x);
  }
}
