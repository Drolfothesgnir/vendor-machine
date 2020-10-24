import GridView from "./GridView";
import "./less/index.less";
import VendorMachine from "./VendorMachine";

const gridRoot = document.getElementById("root");
const numpad = document.getElementById("numpad");
const display = document.getElementById("display");
const ok = document.getElementById("ok");
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
  prices
);

const view = new GridView(vm.grid);
vm.onError(console.log);
view.render(gridRoot!);

numpad?.addEventListener("click", (e) => {
  const value = (e.target as HTMLElement).dataset.index;
  if (value) {
    vm.selectPosition(+value - 1);
  }
});

ok?.addEventListener("click", () => {
  const product = vm.purchase();
  if (product) {
    display!.innerText = "0";
    view.removeProduct(product.pos[1], product.pos[0]);
    console.log(product);
  }
});

function insertCoin(coin: number) {
  const returnedValue = vm.insertCoin(coin);
  if (returnedValue === null) {
    display!.innerText = vm.insertedCoinsValue.toString();
  }
}

insertCoin(200);
