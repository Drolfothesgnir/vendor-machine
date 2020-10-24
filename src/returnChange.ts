export default function returnChange(sum: number, availableCoins: number[]) {
  if (sum === 0) {
    return {};
  }
  let currentSum = sum;
  const result: { [key: number]: number } = {};
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
