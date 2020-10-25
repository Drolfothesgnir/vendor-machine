import { inRange } from "../utulities";
import NoCoins from "./NoCoinsState";
import VM_Events from "./vmEvents";

export default class WithCoins extends NoCoins {
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
    if (inRange(pos, 0, this.vendorMachine.rows)) {
      this.vendorMachine.posY = pos;
      this.vendorMachine.setState(this.vendorMachine.rowSelected);
      this.vendorMachine.notifier.notify(VM_Events.ROW_SELECTED, pos);
    }
  }
}
