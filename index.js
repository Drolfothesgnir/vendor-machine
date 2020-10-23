const availableCoins = [200, 100, 50, 20, 10, 5];
function change(sum, availableCoins) {
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

const display = document.getElementById("display");
function setDisplayText(text) {
  display.innerText = text;
}
