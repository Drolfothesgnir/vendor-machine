import { inRange } from "../utulities";
import NoCoins from "./NoCoinsState";
import VM_Events from "./vmEvents";

/**
 * This state is active after user inserted coin.
 * Allows to select row and cancel purchasing.
 */
export default class WithCoins extends NoCoins {
  // if user cancels purchasing
  // inserted coins value and position clears,
  // inserted coins drops to change place,
  // state becomes initial NoCoins 
  // and user gets notified
  cancel() {
    const insertedCoins = this.vendorMachine.insertedCoins;
    this.vendorMachine.insertedCoins = {};
    this.vendorMachine.insertedCoinsValue = 0;
    this.vendorMachine.posX = -1;
    this.vendorMachine.posY = -1;
    this.vendorMachine.setState(this.vendorMachine.noCoins);
    this.vendorMachine.returnChange(insertedCoins);
    this.vendorMachine.notifier.notify(VM_Events.CANCELED);
  }

  selectPosition(pos: number) {
    // if user selects valid row 
    // machine row value changes to user-selected,
    // state becomes RowSelected
    // and user gets notified with selected row value as callback parameter
    if (inRange(pos, 0, this.vendorMachine.rows)) {
      this.vendorMachine.posY = pos;
      this.vendorMachine.setState(this.vendorMachine.rowSelected);
      this.vendorMachine.notifier.notify(VM_Events.ROW_SELECTED, pos);
    } else {
      // if selected row is invalid
      // user gets notified with selected row value as callback parameter
      this.vendorMachine.notifier.notify(VM_Events.INVALID_PLACE_SELECTED, pos);
    }
  }
}
