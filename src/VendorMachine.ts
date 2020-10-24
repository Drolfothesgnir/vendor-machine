import Product from "./Product";
import returnChange from "./returnChange";
import { inRange, randomInt } from "./utulities";

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
  rows: number;
  columns: number;
  availableCoins: number[];
  allowedCoinInsertions: { [key: number]: boolean };
  insertedCoinsValue: number;
  insertedCoins: { [key: number]: number };
  posX: number;
  posY: number;
  grid: (Product | null)[][];
  _errCallback?: (id: number, message: string) => void;
  selectPosition: (n: number) => boolean;

  static errors: { [key: number]: string } = {
    0: "Empty place",
    1: "Not enough money",
    2: "Not selected",
  };

  constructor(
    rows: number,
    columns: number,
    availableCoins: number[],
    allowedCoinInsertions: { [key: number]: boolean },
    prices: { [key: number]: number }
  ) {
    this.rows = rows;
    this.columns = columns;
    this.availableCoins = availableCoins;
    this.allowedCoinInsertions = allowedCoinInsertions;
    this.insertedCoinsValue = 0;
    this.insertedCoins = {};
    this.posX = -1;
    this.posY = -1;
    this.grid = generateRandomGrid(rows, columns, prices, 2);
    this.selectPosition = this._selectPosY;
  }

  onError(cb: (id: number, message: string) => void) {
    this._errCallback = cb;
  }

  insertCoin(coin: number) {
    if (this.allowedCoinInsertions[coin]) {
      this.insertedCoinsValue += coin;
      this.insertedCoins[coin] = this.insertedCoins[coin] + 1 || 1;
      return null;
    }
    return coin;
  }

  cancel() {
    const insertedCoins = this.insertedCoins;
    this.insertedCoins = {};
    this.insertedCoinsValue = 0;
    this.cancelPositionSelection();
    return insertedCoins;
  }

  _selectPosX(x: number) {
    if (inRange(x, 0, this.columns)) {
      this.posX = x;
      this.selectPosition = () => true;
      return true;
    }
    return false;
  }

  _selectPosY(y: number) {
    if (inRange(y, 0, this.rows)) {
      this.posY = y;
      this.selectPosition = this._selectPosX;
      return true;
    }
    return false;
  }

  cancelPositionSelection() {
    this.posX = -1;
    this.posY = -1;
    this.selectPosition = this._selectPosY;
  }

  errCallback(errId: number) {
    if (this._errCallback) {
      this._errCallback(errId, VendorMachine.errors[errId]);
    }
    return null;
  }

  purchase() {
    if (this.posX > -1 && this.posY > -1) {
      const product = this.grid[this.posY][this.posX];
      if (product === null) {
        this.cancelPositionSelection();
        return this.errCallback(0);
      }
      if (product.price > this.insertedCoinsValue) {
        this.cancelPositionSelection();
        return this.errCallback(1);
      }
      const oddMoney = this.insertedCoinsValue - product.price;
      product.quantity -= 1;
      const x = this.posX,
        y = this.posY;
      if (product.quantity <= 0) {
        this.grid[this.posX][this.posX] = null;
      }
      this.cancelPositionSelection();

      return {
        product: new Product(product.id, product.price, 1),
        change: returnChange(oddMoney, this.availableCoins),
        pos: [x, y],
      };
    }
    return this.errCallback(2);
  }
}
