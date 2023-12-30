import clsx from "clsx";
import { KeyPad } from "./definitions";

export default function Key({
  keypad,
  handler,
}: {
  keypad: KeyPad;
  handler: React.MouseEventHandler<HTMLButtonElement>;
}): JSX.Element {
  return (
    <button
      className={clsx(
        "rounded p-8 text-2xl font-semibold shadow",
        keypad.cssAmend,
      )}
      value={keypad.value}
      id={keypad.id}
      key={keypad.id}
      onClick={handler}
    >
      {keypad.value}
    </button>
  );
}
