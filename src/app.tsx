import Key from "./ui/key";
import {
  CLEAR,
  DECIMAL,
  EQUALS,
  KeyPad,
  Numeric,
  Operator,
} from "./lib/definitions";
import { calculate } from "./lib/math";
import { useEffect, useState } from "react";

export default function App() {
  const keyStyleStd =
    "bg-gradient-to-b from-slate-500 to-indigo-500 hover:from-slate-700 hover:to-indigo-700";
  const keyStyleHighlight =
    "bg-gradient-to-b from-teal-500 to-cyan-500 hover:from-cyan-700 hover:to-cyan-700";

  const [display, setDisplay] = useState<string>("0");
  const [subtotal, setSubtotal] = useState<number>(0);
  const [negative, setNegative] = useState<boolean>(false);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [reset, setReset] = useState<boolean>(false);
  const [highlighted, setHighlighted] = useState<Operator | null>(null);

  useEffect(() => {
    const twClassNames = ["ring-2", "ring-amber-200"];

    if (highlighted !== null) {
      const _highighted = document.querySelector(`#${highlighted}`);
      twClassNames.forEach((classname) => {
        _highighted?.classList.remove(classname);
      });
    }

    if (operator === null) return;

    const _operator = document.querySelector(`#${operator}`);

    if (!_operator) {
      console.error(
        "an element with an id of '%s' could not be found.",
        operator,
      );
      return;
    }

    twClassNames.forEach((classname) => {
      _operator.classList.add(classname);
    });

    setHighlighted(operator);
  }, [operator]);

  const onClickClear: React.MouseEventHandler<HTMLButtonElement> = (
    e: React.MouseEvent,
  ): void => {
    e.preventDefault();
    e.stopPropagation();

    const id = e.currentTarget.id;

    if (!id) {
      console.error("button does not have an 'id' attribute.");
      return;
    }

    if (id !== CLEAR) {
      console.error("invalid id for '%s' button - '%s'", CLEAR, id);
      return;
    }

    const value = (e.currentTarget as HTMLButtonElement).value;

    if (!value) {
      console.error("value is '%s' for button with id '%s'", value, id);
      return;
    }

    setSubtotal(0);
    setOperator(null);
    setDisplay("0");
    setNegative(false);
  };

  const onClickDecimal: React.MouseEventHandler<HTMLButtonElement> = (
    e: React.MouseEvent,
  ): void => {
    e.preventDefault();
    e.stopPropagation();

    const id = e.currentTarget.id;

    if (!id) {
      console.error("button does not have an 'id' attribute.");
      return;
    }

    if (id !== DECIMAL) {
      console.error("invalid id for '%s' button - '%s'", DECIMAL, id);
      return;
    }

    const value = (e.currentTarget as HTMLButtonElement).value;

    if (!value) {
      console.error("value is '%s' for button with id '%s'", value, id);
      return;
    }

    if (!display.includes(".")) {
      setDisplay(display + value);
    }
  };

  const onClickNumeric: React.MouseEventHandler<HTMLButtonElement> = (
    e: React.MouseEvent,
  ): void => {
    e.preventDefault();
    e.stopPropagation();

    const id = e.currentTarget.id;

    if (!id) {
      console.error("button does not have an 'id' attribute.");
      return;
    }

    if (Object.values(Numeric).includes(id as Numeric) === false) {
      console.error("invalid id = '%s'", id);
      return;
    }

    const value = (e.currentTarget as HTMLButtonElement).value;

    if (!value) {
      console.error("value is '%s' for button with id '%s'", value, id);
      return;
    }

    let _display =
      display === "0" || isNaN(parseFloat(display)) || reset ? "" : display;

    if (reset) {
      setReset(false);
    }

    setDisplay(_display + value);
  };

  const onClickOperator: React.MouseEventHandler<HTMLButtonElement> = (
    e: React.MouseEvent,
  ): void => {
    e.preventDefault();
    e.stopPropagation();

    const id = e.currentTarget.id;

    if (!id) {
      console.error("button does not have an 'id' attribute.");
      return;
    }

    if (Object.values(Operator).includes(id as Operator) === false) {
      console.error("invalid id = '%s'", id);
      return;
    }

    const value = (e.currentTarget as HTMLButtonElement).value;

    if (!value) {
      console.error("value is '%s' for button with id '%s'", value, id);
      return;
    }

    const current = parseFloat(display);

    if (isNaN(current)) {
      console.error("'%s' is not a number", current);
      return;
    }

    if (operator) {
      const _previous = calculate(subtotal, current, operator);
      setSubtotal(_previous);
      setDisplay(_previous.toString());
      setOperator(id as Operator);
      setReset(true);

      // if (!negative && (id as Operator) === Operator.subtract) {
      //   setNegative(true);
      // } else {
      //   const _previous = calculate(subtotal, current, operator);
      //   setSubtotal(_previous);
      //   setDisplay(_previous.toString());
      //   setOperator(id as Operator);
      //   setReset(true);
      // }
    } else {
      setSubtotal(current);
      setOperator(id as Operator);
      setReset(true);
    }
  };

  const onClickEquals: React.MouseEventHandler<HTMLButtonElement> = (
    e: React.MouseEvent,
  ): void => {
    e.preventDefault();
    e.stopPropagation();

    const id = e.currentTarget.id;

    if (!id) {
      console.error("button does not have an 'id' attribute.");
      return;
    }

    if (id !== EQUALS) {
      console.error("invalid id for '%s' button - '%s'", EQUALS, id);
      return;
    }

    const value = (e.currentTarget as HTMLButtonElement).value;

    if (!value) {
      console.error("value is '%s' for button with id '%s'", value, id);
      return;
    }

    let current = parseFloat(display);

    if (isNaN(current)) {
      console.error("'%s' is not a number", current);
      return;
    }

    if (operator && subtotal) {
      if (negative) {
        current = current * -1;
      }
      setDisplay(calculate(subtotal, current, operator).toString());
      setSubtotal(0);
      setOperator(null);
      setReset(true);
    }
  };

  const keys: Array<KeyPad> = [
    {
      value: "AC",
      id: CLEAR,
      cssAmend: `${keyStyleHighlight} col-span-2`,
      handler: onClickClear,
    },
    {
      value: "/",
      id: Operator.divide,
      cssAmend: keyStyleStd,
      handler: onClickOperator,
    },
    {
      value: "*",
      id: Operator.multiply,
      cssAmend: keyStyleStd,
      handler: onClickOperator,
    },
    {
      value: "1",
      id: Numeric.one,
      cssAmend: keyStyleStd,
      handler: onClickNumeric,
    },
    {
      value: "2",
      id: Numeric.two,
      cssAmend: keyStyleStd,
      handler: onClickNumeric,
    },
    {
      value: "3",
      id: Numeric.three,
      cssAmend: keyStyleStd,
      handler: onClickNumeric,
    },
    {
      value: "+",
      id: Operator.add,
      cssAmend: keyStyleStd,
      handler: onClickOperator,
    },
    {
      value: "4",
      id: Numeric.four,
      cssAmend: keyStyleStd,
      handler: onClickNumeric,
    },
    {
      value: "5",
      id: Numeric.five,
      cssAmend: keyStyleStd,
      handler: onClickNumeric,
    },
    {
      value: "6",
      id: Numeric.six,
      cssAmend: keyStyleStd,
      handler: onClickNumeric,
    },
    {
      value: "-",
      id: Operator.subtract,
      cssAmend: keyStyleStd,
      handler: onClickOperator,
    },
    {
      value: "7",
      id: Numeric.seven,
      cssAmend: keyStyleStd,
      handler: onClickNumeric,
    },
    {
      value: "8",
      id: Numeric.eight,
      cssAmend: keyStyleStd,
      handler: onClickNumeric,
    },
    {
      value: "9",
      id: Numeric.nine,
      cssAmend: keyStyleStd,
      handler: onClickNumeric,
    },
    {
      value: "=",
      id: EQUALS,
      cssAmend: `${keyStyleHighlight} row-span-2`,
      handler: onClickEquals,
    },
    {
      value: "0",
      id: Numeric.zero,
      cssAmend: `${keyStyleStd} col-span-2`,
      handler: onClickNumeric,
    },
    {
      value: ".",
      id: DECIMAL,
      cssAmend: keyStyleStd,
      handler: onClickDecimal,
    },
  ];

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
            return <Key key={key.value} keypad={key} handler={key.handler} />;
          })}
        </div>
      </div>
    </main>
  );
}
