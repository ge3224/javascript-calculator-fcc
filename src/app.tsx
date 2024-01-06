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
import { parseSymbol } from "./lib/operator";

/**
 * The App component is the main component of the application and contains the logic and rendering
 * for the JavaScript calculator. The calculator supports basic arithmetic operations and follows a
 * responsive design.
 */
export default function App() {
  // Styling Constants: Definitions for styling classes used in the component.
  const keyStyleStd =
    "bg-gradient-to-b from-slate-500 to-indigo-500 hover:from-slate-700 hover:to-indigo-700";
  const keyStyleHighlight =
    "bg-gradient-to-b from-teal-500 to-cyan-500 hover:from-cyan-700 hover:to-cyan-700";

  // State Variables: Declarations for state variables using React's useState hook.
  const [operations, setOperations] = useState<Array<string>>(["0"]);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [reset, setReset] = useState<boolean>(false);
  const [highlighted, setHighlighted] = useState<Operator | null>(null);

  // Effect Hook: Utilizes the useEffect hook to manage CSS classes for highlighting operator
  // buttons (e.g., +, -, *, /).
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
  }, [operator, highlighted]);

  // Event Handlers: Functions that handle various button click events (e.g., numeric,
  // operator, equals).
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

    setOperator(null);
    setOperations(["0"]);
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

    const opts = operations.slice(0, operations.length);

    if (reset) {
      opts.length = 0;
      opts.push(value);
      setOperations(opts);
      setReset(false);
      return;
    }

    if (
      parseSymbol(opts[opts.length - 1]) &&
      !parseSymbol(opts[opts.length - 2]) &&
      opts.length > 1
    ) {
      opts.push(value);
    } else {
      opts[opts.length - 1] =
        opts[opts.length - 1] !== "0" ? opts[opts.length - 1] + value : value;
    }

    setOperations(opts);
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

    const opts = operations.slice(0, operations.length);

    if (reset) {
      opts.length = 0;
      opts.push(value);
      setOperations(opts);
      setReset(false);
      return;
    }

    if (!opts[opts.length - 1].includes(".")) {
      opts[opts.length - 1] = opts[opts.length - 1] + value;
      setOperations(opts);
    }
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

    let opts = operations.slice(0, operations.length);

    // disable a reset
    if (reset) {
      setReset(false);
    }

    if (opts.length < 2 && opts[0] === "0") {
      opts[0] = value;
      setOperations(opts);
      return;
    }

    // check if the previous element is an operator
    if (parseSymbol(opts[opts.length - 1])) {
      // if this is the third operator in succession, replace the previous two or do nothing
      // because the third is a repeated minus.
      if (parseSymbol(opts[opts.length - 2])) {
        if (value !== "-") {
          opts = opts.slice(0, opts.length - 2);
          opts.push(value);
          setOperations(opts);
          return;
        } else {
          return;
        }
      }
      // replace the previous with the new operator unless the new operator is minus ('-')
      if (value !== "-") {
        opts[opts.length - 1] = value;
        setOperations(opts);
        return;
      }
    }

    opts.push(value);
    setOperations(opts);
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

    let operator: Operator | null = null;

    const result = operations.reduce((total, item, index) => {
      const parsed = parseFloat(item);

      if (isNaN(parsed)) {
        const _operator = parseSymbol(item);
        operator = _operator;
      } else if (index === 0) {
        total = parsed;
      } else if (operator) {
        total = calculate(total, parsed, operator);
        operator = null;
      }

      return total;
    }, 0);

    setOperations([result.toString()]);
    setReset(true);
  };

  // Key Definitions:  An array defining the properties of each key on the calculator keypad.
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

  // Rendering: JSX code that renders the calculator interface, including the display and keypad.
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-2 bg-slate-900 px-8 pb-12 pt-8">
      <div>
        <div
          className="mb-2 h-14 w-full rounded bg-slate-950 p-2 text-right text-4xl text-slate-300"
          id="display"
        >
          {operations.join("")}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {keys.map((key) => {
            return <Key key={key.value} keypad={key} handler={key.handler} />;
          })}
        </div>
      </div>
      {/* GitHub Link: A link to the source code repository on GitHub. */}
      <div className="mt-8 w-full text-center text-sm text-slate-100 underline visited:text-slate-100">
        <a
          href="https://github.com/ge3224/javascript-calculator-fcc"
          target="_blank"
        >
          Source Code on Github
        </a>
      </div>
    </main>
  );
}
