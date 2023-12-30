import { useState } from "react";
import { KeyPad, Numeric, Operator } from "./lib/definitions";
import Key from "./ui/key";
import { resolve } from "./lib/math";
import { numberFromString } from "./lib/parse";

export default function App() {
  const keyStyleStd =
    "bg-gradient-to-b from-slate-500 to-indigo-500 hover:from-slate-700 hover:to-indigo-700";
  const keyStyleHighlight =
    "bg-gradient-to-b from-teal-500 to-cyan-500 hover:from-cyan-700 hover:to-cyan-700";

  const keys: Array<KeyPad> = [
    { value: "AC", id: "clear", cssAmend: `${keyStyleHighlight} col-span-2` },
    { value: "/", id: Operator.divide, cssAmend: keyStyleStd },
    { value: "*", id: Operator.multiply, cssAmend: keyStyleStd },
    { value: "1", id: Numeric.one, cssAmend: keyStyleStd },
    { value: "2", id: Numeric.two, cssAmend: keyStyleStd },
    { value: "3", id: Numeric.three, cssAmend: keyStyleStd },
    { value: "+", id: Operator.add, cssAmend: keyStyleStd },
    { value: "4", id: Numeric.four, cssAmend: keyStyleStd },
    { value: "5", id: Numeric.five, cssAmend: keyStyleStd },
    { value: "6", id: Numeric.six, cssAmend: keyStyleStd },
    { value: "-", id: Operator.subtract, cssAmend: keyStyleStd },
    { value: "7", id: Numeric.seven, cssAmend: keyStyleStd },
    { value: "8", id: Numeric.eight, cssAmend: keyStyleStd },
    { value: "9", id: Numeric.nine, cssAmend: keyStyleStd },
    { value: "=", id: "equals", cssAmend: `${keyStyleHighlight} row-span-2` },
    { value: "0", id: Numeric.zero, cssAmend: `${keyStyleStd} col-span-2` },
    { value: ".", id: "decimal", cssAmend: keyStyleStd },
  ];

  const [display, setDisplay] = useState<string>("0");
  const [previous, setPrevious] = useState<number>(0);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [reset, setReset] = useState<boolean>(false);

  const onClickHandler: React.MouseEventHandler<HTMLButtonElement> = (
    e: React.MouseEvent,
  ): void => {
    e.preventDefault();
    e.stopPropagation();

    const id = e.currentTarget.id;

    if (!id) {
      console.error("button does not have an 'id' attribute.");
      return;
    }

    const value = (e.currentTarget as HTMLButtonElement).value;

    if (!value) {
      console.error("value is '%s' for button with id '%s'", value, id);
      return;
    }

    if (id === "clear") {
      setPrevious(0);
      setOperator(null);
      setDisplay("0");
      return;
    }

    if (id === "decimal") {
      if (!display.includes(".")) {
        setDisplay(display + value);
      }
      return;
    }

    if (Object.values(Numeric).includes(id as Numeric)) {
      let _display =
        display === "0" || isNaN(parseFloat(display)) || reset ? "" : display;

      setDisplay(_display + value);

      if (reset) {
        setReset(false);
      }

      return;
    }

    if (Object.values(Operator).includes(id as Operator)) {
      const current = numberFromString(display);

      if (operator !== null) {
        setPrevious(resolve(previous, current, operator));
        setOperator(id as Operator);
        setDisplay(value);
      } else if (previous === 0) {
        setPrevious(current);
        setOperator(id as Operator);
        setDisplay(value);
      }
      return;
    }

    if (id === "equals") {
      const current = numberFromString(display);

      if (operator) {
        setDisplay(resolve(previous, current, operator).toString());
        setPrevious(0);
        setReset(true);
      }
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-2 bg-slate-900 px-8 pb-12 pt-8">
      <div>
        <div
          className="mb-2 h-14 w-full rounded bg-slate-950 p-2 text-right text-4xl text-slate-300"
          id="display"
        >
          {display}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {keys.map((key) => {
            return (
              <Key key={key.value} keypad={key} handler={onClickHandler} />
            );
          })}
        </div>
      </div>
    </main>
  );
}
