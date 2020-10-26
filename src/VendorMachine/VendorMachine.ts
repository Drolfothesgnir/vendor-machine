import NoCoins from "./NoCoinsState";
import State from "./StateInterface";
import WithCoins from "./WithCoinsState";
import RowSelected from "./RowSelectedState";
import Product from "../Product";
import ColumnSelected from "./ColumnSelectedState";
import { randomInt } from "../utulities";
import Notifier from "./Notifier";

/**
 * Helper function to generate product grid as multi-dimensional array and populate it with random products.
 * Each product has id in range between minId and maxId.
 */
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
/**
 * VendorMachine implemented using State design pattern
 */
export default class VendorMachine {
  /** Active state of machine. */
  private state: State;
  /** Number of stages in product grid. */
  rows: number;
  /** Number of products in one stage of product grid. */
  columns: number;
  /** List of available coin types for purchasing and giving change. */
  availableCoins: number[];
  /** Set of coin types allowed for insertion. */
  allowedCoinInsertions: { [key: number]: boolean };
  /** Sum of all coins inserted. */
  insertedCoinsValue: number;
  /** Map of all coins inserted with coin type as key and coin quantity as value. */
  insertedCoins: { [key: number]: number };
  /** User-selected column. */
  posX: number;
  /** User-selected row. */
  posY: number;
  /** NoCoins state instance. */
  noCoins: State;
  /** WithCoins state instance. */
  withCoins: State;
  /** RowSelected state instance. */
  rowSelected: State;
  /** ColumnSelected state instance. */
  columnSelected: State;
  /** Product grid. */
  grid: (Product | null)[][];
  /** Map of all changed coins with coin type as key and coin quantity as value. */
  changePlace: { [key: number]: number };
  /** List of all purchased products. */
  productPlace: Product[];
  /** Notifier instance. */
  notifier: Notifier;

  constructor(
    rows: number,
    columns: number,
    availableCoins: number[],
    allowedCoinInsertions: { [key: number]: boolean },
    prices: { [key: number]: number },
    /** Max id product can have. */
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

  /** Changes current machine state. */
  setState(state: State) {
    this.state = state;
  }

  /** Returns all available change and clears change place. */
  getChange() {
    const change = this.changePlace;
    this.changePlace = {};
    return change;
  }

  /** Returns all purchased products and clears product place. */
  dispense() {
    const product = this.productPlace;
    if (product.length) {
      this.productPlace = [];
      return product;
    }
    return null;
  }

  /** Adding specified change to change place. */
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

  /** Subscribes callback on specified machine event. */
  on(event: number, cb: (...value: any[]) => void) {
    this.notifier.addListener(event, cb);
  }

  /** Unsubscribes callback on specified machine event. */
  off(event: number, cb: (...value: any[]) => void) {
    this.notifier.removeListener(event, cb);
  }
}
