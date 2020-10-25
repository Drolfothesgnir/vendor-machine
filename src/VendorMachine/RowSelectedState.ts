import { inRange } from "../utulities";
import VM_Events from "./vmEvents";
import WithCoins from "./WithCoinsState";

export default class RowSelected extends WithCoins {
  insertCoin() {}

  selectPosition(pos: number) {
    if (inRange(pos, 0, this.vendorMachine.columns)) {
      this.vendorMachine.posX = pos;
      this.vendorMachine.setState(this.vendorMachine.columnSelected);
      this.vendorMachine.notifier.notify(VM_Events.COLUMN_SELECTED, pos)
    }
  }

  cancelPositionSelection() {
    this.vendorMachine.posX = -1;
    this.vendorMachine.posY = -1;
    this.vendorMachine.setState(this.vendorMachine.withCoins);
    this.vendorMachine.notifier.notify(VM_Events.POS_SELECTION_CANCELED);
  }
}
