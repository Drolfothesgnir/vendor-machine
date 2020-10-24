import "./index.less";
import VendorMachine from "./VendorMachine";
const availableCoins = [200, 100, 50, 20, 10, 5];
const prices = { 0: 220, 1: 190, 2: 315 };
const vm = new VendorMachine(
  5,
  5,
  availableCoins,
  { 200: true, 100: true, 50: true },
  prices
);

console.log(vm);
