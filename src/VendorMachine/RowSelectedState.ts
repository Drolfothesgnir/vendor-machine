import { inRange } from "../utulities";
import VM_Events from "./vmEvents";
import WithCoins from "./WithCoinsState";

/**
 * Activated when row is selected. 
 * Allows to select column, cancel position selection and cancel purchasing.
 */
export default class RowSelected extends WithCoins {
  insertCoin() {}

  // if user selects valid column 
  // machine column value changes to user-selected,
  // state becomes ColumnSelected
  // and user gets notified with selected column value as callback parameter
  selectPosition(pos: number) {
    if (inRange(pos, 0, this.vendorMachine.columns)) {
      this.vendorMachine.posX = pos;
      this.vendorMachine.setState(this.vendorMachine.columnSelected);
      this.vendorMachine.notifier.notify(VM_Events.COLUMN_SELECTED, pos);
    } else {
      // if selected column is invalid
      // user gets notified with selected column value as callback parameter
      this.vendorMachine.notifier.notify(VM_Events.INVALID_PLACE_SELECTED, pos);
    }
  }

  // user-selected row and column clears,
  // state returns to WithCoins
  // and user gets notified
  cancelPositionSelection() {
    this.vendorMachine.posX = -1;
    this.vendorMachine.posY = -1;
    this.vendorMachine.setState(this.vendorMachine.withCoins);
    this.vendorMachine.notifier.notify(VM_Events.POS_SELECTION_CANCELED);
  }
}
