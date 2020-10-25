import GridView from "./GridView";
import "./less/index.less";
import VendorMachine from "./VendorMachine/VendorMachine";
import VM_Events from "./VendorMachine/vmEvents";

const gridRoot = document.getElementById("root");
const numpad = document.getElementById("numpad");
const display = document.getElementById("display");
const ok = document.getElementById("ok");
const coins = document.getElementById("coins");
const availableCoins = [200, 100, 50, 20, 10, 5];
const allowedCoinInsertions = { 200: true, 100: true, 50: true };
const prices = {
  0: 220, //snickers
  1: 190, //mars
  2: 315, //bomba
};
const vm = new VendorMachine(
  5,
  5,
  availableCoins,
  allowedCoinInsertions,
  prices,
  2
);

const view = new GridView(vm.grid);
view.render(gridRoot!);

vm.on(VM_Events.COIN_INSERTED, (coin) => {
  display!.innerText = vm.insertedCoinsValue.toString();
  console.log("inserted coin: ", coin);
});
vm.on(VM_Events.ROW_SELECTED, (row) => console.log("selected row: ", row));
vm.on(VM_Events.COLUMN_SELECTED, (col) =>
  console.log("selected column: ", col)
);
vm.on(VM_Events.PURCHASED, (row, col) => {
  view.removeProduct(row, col);
  console.log("purchased", row, col);
  console.log("product: ", vm.dispense(), "\nchange: ", vm.getChange());
});

numpad?.addEventListener("click", (e) => {
  const value = (e.target as HTMLElement).dataset.index;
  if (value) {
    vm.selectPosition(+value - 1);
  }
});

coins?.addEventListener("click", (e) => {
  const value = (e.target as HTMLElement).dataset.value;
  if (value) {
    vm.insertCoin(+value);
  }
});

ok?.addEventListener("click", () => {
  vm.purchase();
});
