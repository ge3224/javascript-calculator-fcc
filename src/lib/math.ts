import { Operator } from "../lib/definitions";

export function calculate(x: number, y: number, math: Operator): number {
  switch (math) {
    case Operator.add:
      return x + y;
    case Operator.subtract:
      return x - y;
    case Operator.multiply:
      return x * y;
    case Operator.divide:
      return x / y;
    default:
      return y;
  }
}
