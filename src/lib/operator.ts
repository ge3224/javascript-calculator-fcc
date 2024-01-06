import { Operator } from "./definitions";

export function parseSymbol(input: string): Operator | null {
  switch (input) {
    case "+":
      return Operator.add;
    case "-":
      return Operator.subtract;
    case "*":
      return Operator.multiply;
    case "/":
      return Operator.divide;
    default:
      return null;
  }
}
