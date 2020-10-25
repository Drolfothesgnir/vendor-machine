import VendorMachine from "./VendorMachine";

export default interface State {
  vendorMachine: VendorMachine;
  insertCoin(coin: number): void;
  cancel(): void;
  selectPosition(pos: number): void;
  cancelPositionSelection(): void;
  purchase(): void;
}
