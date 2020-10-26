import GridView from "./GridView";
import VendorMachine from "./VendorMachine/VendorMachine";
import VM_Events from "./VendorMachine/vmEvents";
import "./less/index.less";

// required UI elements
/** Grid view root element. */
const gridRoot = document.getElementById("root")!;
/** Set of button for position selection.  */
const numpad = document.getElementById("numpad")!;
/** Element for showing machine messages. */
const display = document.getElementById("display")!;
/** Purchase button. */
const ok = document.getElementById("ok")!;
/** Cancel purchasing button. */
const cancel = document.getElementById("cancel")!;
/** Set of buttons for coin inserting. */
const coins = document.getElementById("coins")!;
/** Cancel position selection button. */
const cancelPos = document.getElementById("cancel-pos")!;
/** Element where purchased product appeares. */
const productPlace = document.getElementById("product-place")!;
/** Set of buttons representing changed coins. */
const changePlace = document.getElementById("change")!;

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
view.render(gridRoot);

/** Map with returned coin type as key and corresponding HTML button as value. */
const oddMoney: { [key: number]: HTMLElement } = {};
availableCoins.forEach((coin) => {
  oddMoney[coin] = changePlace.querySelector(
    `[data-value="${coin}"`
  )! as HTMLElement;
});

/** Map with all returned change. */
const currentChange: { [key: number]: number } = {};

/** Helper function to update UI and currentChange. */
function returnChange(change: { [key: number]: number }) {
  for (let coin in change) {
    currentChange[coin] = currentChange[coin] + change[coin] || change[coin];
    if (currentChange[coin] > 0) {
      oddMoney[coin].classList.remove("hidden");

      if (currentChange[coin] > 1) {
        oddMoney[coin].dataset.count = currentChange[coin].toString();
      }
    }
  }
}

/** Helper function to update UI and currentChange when inserting coin from change place. */
function insertCoinFromChange(coin: number) {
  if (coin in currentChange) {
    currentChange[coin] -= 1;
    oddMoney[coin].dataset.count = currentChange[coin].toString();
    if (currentChange[coin] < 2) {
      oddMoney[coin].dataset.count = "";
    }
    if (currentChange[coin] < 1) {
      oddMoney[coin].classList.add("hidden");
    }
    vm.insertCoin(coin);
  }
}

function showRunningSum() {
  display.innerText = vm.insertedCoinsValue.toString();
}

let timerID: NodeJS.Timeout;
function showRunningSumWithDelay(delay: number) {
  clearTimeout(timerID);
  timerID = setTimeout(showRunningSum, delay);
}

vm.on(VM_Events.COIN_INSERTED, (coin) => {
  showRunningSum();
  console.log("inserted coin: ", coin);
});

vm.on(VM_Events.ROW_SELECTED, (row) => {
  row += 1;
  display.innerText = "ROW: " + row;
  showRunningSumWithDelay(2500);
  console.log("selected row: ", row);
});

vm.on(VM_Events.COLUMN_SELECTED, (col) => {
  col += 1;
  display.innerText = "COL: " + col;
  showRunningSumWithDelay(2500);
  console.log("selected column: ", col);
});

vm.on(VM_Events.INVALID_PLACE_SELECTED, (pos) => {
  display.innerText = "INVALID";
  showRunningSumWithDelay(2500);
  console.log("invalid place selected: ", pos + 1);
});

vm.on(VM_Events.PURCHASED, (row, col) => {
  view.removeProduct(row, col);
  display.innerText = "";
  console.log("purchased", row + 1, col + 1);
  const product = vm.dispense()!;
  const purchased = document.createElement("span");
  purchased.className = "product";
  purchased.dataset.productId = product[0].id.toString();
  const left = (col / vm.columns) * 100;
  purchased.style.left = left + "%";
  purchased.style.width = 100 / vm.columns + "%";
  productPlace.appendChild(purchased);
  setTimeout(() => {
    productPlace.removeChild(purchased);
  }, 3000);
  const change = vm.getChange();
  returnChange(change);
  console.log("product: ", product, "\nchange: ", change);
});

vm.on(VM_Events.INVALID_COIN, (coin) => {
  display.innerText = "INVALID";
  showRunningSumWithDelay(2500);
  const change = vm.getChange();
  returnChange(change);
  console.log("invalid coin: ", coin);
});

vm.on(VM_Events.EMPTY_PLACE_SELECTED, (row, col) => {
  display.innerText = "EMPTY";
  showRunningSumWithDelay(2500);
  console.log("Empty place selected, row: %d, col: %d", row + 1, col + 1);
});

vm.on(VM_Events.NOT_ENOUGH_MONEY, () => {
  display.innerText = "ERROR";
  showRunningSumWithDelay(2500);
  console.log("not enough money");
});

vm.on(VM_Events.CANCELED, () => {
  clearTimeout(timerID);
  display.innerText = "";
  const change = vm.getChange();
  returnChange(change);
  console.log("canceled", change);
});

vm.on(VM_Events.POS_SELECTION_CANCELED, () => {
  display.innerText = "CANCEL";
  showRunningSumWithDelay(2500);
  console.log("position selection canceled");
});

numpad.addEventListener("click", (e) => {
  const value = (e.target as HTMLElement).dataset.index;
  if (value) {
    vm.selectPosition(+value - 1);
  }
});

coins.addEventListener("click", (e) => {
  const value = (e.target as HTMLElement).dataset.value;
  if (value) {
    vm.insertCoin(+value);
  }
});

ok.addEventListener("click", () => {
  vm.purchase();
});

cancel.addEventListener("click", () => vm.cancel());

cancelPos.addEventListener("click", () => vm.cancelPositionSelection());

changePlace.addEventListener("click", (e) => {
  const value = (e.target as HTMLElement).dataset.value;
  if (value) {
    insertCoinFromChange(+value);
  }
});
