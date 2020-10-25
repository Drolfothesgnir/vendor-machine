export function randomInt(max: number, min = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function inRange(value: number, min: number, max: number) {
  return value >= min && value <= max;
}
export  function computeChange(sum: number, availableCoins: number[]) {
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