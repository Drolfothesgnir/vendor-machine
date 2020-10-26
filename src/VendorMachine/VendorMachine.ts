import NoCoins from "./NoCoinsState";
import State from "./StateInterface";
import WithCoins from "./WithCoinsState";
import RowSelected from "./RowSelectedState";
import Product from "../Product";
import ColumnSelected from "./ColumnSelectedState";
import { randomInt } from "../utulities";
import Notifier from "./Notifier";

function generateRandomGrid(
  rows: number,
  columns: number,
  prices: { [key: number]: number },
  maxId: number,
  minId = 0
) {
  const grid = [];
  for (let y = 0; y < rows; y++) {
    const row = [];
    for (let x = 0; x < columns; x++) {
      if (Math.random() > 0.5) {
        const id = randomInt(maxId, minId);
        row.push(new Product(id, prices[id], 3));
      } else {
        row.push(null);
      }
    }
    grid.push(row);
  }
  return grid;
}

export default class VendorMachine {
  private state: State;
  rows: number;
  columns: number;
  availableCoins: number[];
  allowedCoinInsertions: { [key: number]: boolean };
  insertedCoinsValue: number;
  insertedCoins: { [key: number]: number };
  posX: number;
  posY: number;
  noCoins: State;
  withCoins: State;
  rowSelected: State;
  columnSelected: State;
  grid: (Product | null)[][];
  changePlace: { [key: number]: number };
  productPlace: Product[];
  notifier: Notifier;

  constructor(
    rows: number,
    columns: number,
    availableCoins: number[],
    allowedCoinInsertions: { [key: number]: boolean },
    prices: { [key: number]: number },
    maxId: number
  ) {
    this.rows = rows;
    this.columns = columns;
    this.availableCoins = availableCoins;
    this.allowedCoinInsertions = allowedCoinInsertions;
    this.insertedCoinsValue = 0;
    this.insertedCoins = {};
    this.posX = -1;
    this.posY = -1;
    this.grid = generateRandomGrid(rows, columns, prices, maxId);
    this.changePlace = {};
    this.productPlace = [];
    const noCoins = new NoCoins(this);
    this.state = noCoins;
    this.noCoins = noCoins;
    this.withCoins = new WithCoins(this);
    this.rowSelected = new RowSelected(this);
    this.columnSelected = new ColumnSelected(this);
    this.notifier = new Notifier();
  }

  setState(state: State) {
    this.state = state;
  }

  getChange() {
    const change = this.changePlace;
    this.changePlace = {};
    return change;
  }

  dispense() {
    const product = this.productPlace;
    if (product.length) {
      this.productPlace = [];
      return product;
    }
    return null;
  }

  returnChange(change: { [key: number]: number }) {
    this.changePlace = { ...this.changePlace, ...change };
  }

  insertCoin(coin: number) {
    this.state.insertCoin(coin);
  }

  selectPosition(pos: number) {
    this.state.selectPosition(pos);
  }

  cancel() {
    this.state.cancel();
  }

  cancelPositionSelection() {
    this.state.cancelPositionSelection();
  }

  purchase() {
    this.state.purchase();
  }

  on(event: number, cb: (...value: any[]) => void) {
    this.notifier.addListener(event, cb);
  }

  off(event: number, cb: (...value: any[]) => void) {
    this.notifier.removeListener(event, cb);
  }
}
