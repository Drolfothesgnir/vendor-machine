export function randomInt(max: number, min = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function inRange(value: number, min: number, max: number) {
  return value >= min && value <= max;
}
