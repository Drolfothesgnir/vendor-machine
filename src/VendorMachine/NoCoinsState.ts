import VendorMachine from "./VendorMachine";
import State from "./StateInterface";
import VM_Events from "./vmEvents";

export default class NoCoins implements State {
  vendorMachine: VendorMachine;
  constructor(vendorMachine: VendorMachine) {
    this.vendorMachine = vendorMachine;
  }

  insertCoin(coin: number) {
    if (this.vendorMachine.allowedCoinInsertions[coin]) {
      this.vendorMachine.insertedCoinsValue += coin;
      this.vendorMachine.insertedCoins[coin] =
        this.vendorMachine.insertedCoins[coin] + 1 || 1;
      this.vendorMachine.setState(this.vendorMachine.withCoins);
      this.vendorMachine.notifier.notify(VM_Events.COIN_INSERTED, coin);
    } else {
      this.vendorMachine.returnChange({ [coin]: 1 });
      this.vendorMachine.notifier.notify(VM_Events.INVALID_COIN, coin);
    }
  }

  cancel() {}

  cancelPositionSelection() {}

  purchase() {}

  selectPosition(pos: number) {}
}
