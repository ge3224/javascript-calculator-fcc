export function numberFromString(value: string): number {
  const number = parseFloat(value);
  if (isNaN(number)) {
    console.error("could not parse float from '%s'", value);
    return 0;
  }
  return number;
}
