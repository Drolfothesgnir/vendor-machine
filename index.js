const availableCoins = [200, 100, 50, 20, 10, 5];
function change(sum, availableCoins) {
  if (sum === 0) {
    return {};
  }
  let currentSum = sum;
  const result = {};
  for (let i = 0; i < availableCoins.length; i++) {
    const value = Math.floor(currentSum / availableCoins[i]);
    if (value >= 1) {
      currentSum = currentSum - value * availableCoins[i];
      result[availableCoins[i]] = value;
      if (currentSum === 0) {
        return result;
      }
    }
  }

  throw Error("Invalid sum or available coins");
}

function randomInt(max, min = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const display = document.getElementById("display");
function setDisplayText(text) {
  display.innerText = text;
}

class Product {
  constructor(id, price, quantity) {
    this.id = id;
    this.price = price;
    this.quantity = quantity;
  }
}

const errors = {
  0: "Empty place",
  1: "Not enough money",
  2: "Not selected",
};

const prices = { 0: 220, 1: 190, 2: 315 };

function generateRandomGrid(rows, columns, maxId, minId = 0) {
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

class VendorMachine {
  constructor(rows, columns, availableCoins, allowedInsertionCoins) {
    this.rows = rows;
    this.columns = columns;
    this.availableCoins = availableCoins;
    this.allowedInsertionCoins = allowedInsertionCoins;
    this.insertedCoinsValue = 0;
    this.insertedCoins = {};
    this.productX = -1;
    this.productY = -1;

    this.grid = generateRandomGrid(rows, columns, 2);
  }

  insertCoin(coin) {
    if (this.allowedInsertionCoins[coin]) {
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

  selectProduct(pos) {
    if (pos >= 0) {
      if (this.productX < 0) {
        this.productX = pos;
      } else if (this.productY < 0) {
        this.productY = pos;
      }
    }
  }

  cancelPositionSelection() {
    this.productX = -1;
    this.productY = -1;
  }

  errCallback(errId) {
    if (this._errCallback) {
      this._errCallback(errId, errors[errId]);
    }
    return null;
  }

  purchase() {
    if (this.productX > -1 && this.productY > -1) {
      const product = this.grid[this.productY][this.productX];
      if (product === null) {
        return this.errCallback(0);
      }
      if (product.price > this.insertedCoinsValue) {
        return this.errCallback(1);
      }
      const oddMoney = this.insertedCoinsValue - product.price;
      product.quantity -= 1;
      if (product.quantity <= 0) {
        this.grid[this.productY][this.productX] = null;
      }
      return {
        product: new Product(product.id, product.price, 1),
        change: change(oddMoney, this.availableCoins),
      };
    }
    return this.errCallback(2);
  }
}

const vm = new VendorMachine(5, 5, availableCoins, {
  200: true,
  100: true,
  50: true,
});
vm.insertCoin(200);
vm.insertCoin(100);
vm.insertCoin(100);
vm._errCallback = console.log;
vm.selectProduct(1);
vm.selectProduct(0);
console.log(vm.purchase());
