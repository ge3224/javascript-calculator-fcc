export enum Numeric {
  zero = "zero",
  one = "one",
  two = "two",
  three = "three",
  four = "four",
  five = "five",
  six = "six",
  seven = "seven",
  eight = "eight",
  nine = "nine",
}

export enum Operator {
  add = "add",
  subtract = "subtract",
  multiply = "multiply",
  divide = "divide",
}

export type KeyPad = {
  value: string;
  id: string;
  cssAmend: string;
};
