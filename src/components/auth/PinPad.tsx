import { useEffect, useRef, useState } from "react";
import { PIN_LENGTH } from "@/lib/profile";
import { cx } from "@/lib/format";

interface Props {
  onComplete: (pin: string) => void;
  /** Bump to clear the boxes and shake (wrong PIN). */
  errorTick?: number;
  autoFocus?: boolean;
  label: string;
}

/** Four single-digit boxes with auto-advance, backspace and paste support. */
export function PinPad({ onComplete, errorTick = 0, autoFocus = true, label }: Props) {
  const [digits, setDigits] = useState<string[]>(Array(PIN_LENGTH).fill(""));
  const [shake, setShake] = useState(false);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!errorTick) return;
    setDigits(Array(PIN_LENGTH).fill(""));
    setShake(true);
    refs.current[0]?.focus();
    const id = window.setTimeout(() => setShake(false), 450);
    return () => window.clearTimeout(id);
  }, [errorTick]);

  const set = (i: number, value: string) => {
    const clean = value.replace(/\D/g, "");
    if (!clean) {
      setDigits((d) => d.map((x, j) => (j === i ? "" : x)));
      return;
    }
    const next = [...digits];
    clean
      .slice(0, PIN_LENGTH - i)
      .split("")
      .forEach((c, k) => (next[i + k] = c));
    setDigits(next);
    const last = Math.min(PIN_LENGTH - 1, i + clean.length);
    if (next.every(Boolean)) {
      refs.current[PIN_LENGTH - 1]?.blur();
      onComplete(next.join(""));
    } else refs.current[last]?.focus();
  };

  return (
    <div className={cx("flex justify-center gap-3", shake && "animate-shake")} role="group" aria-label={label}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={d}
          onChange={(e) => set(i, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
          }}
          onFocus={(e) => e.currentTarget.select()}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={PIN_LENGTH}
          type="password"
          autoComplete="off"
          autoFocus={autoFocus && i === 0}
          aria-label={`${label} ${i + 1}`}
          className="h-14 w-12 rounded-[12px] border border-white/10 bg-black/30 text-center text-2xl font-semibold text-text-hi focus:border-primary/70 focus:outline-hidden"
        />
      ))}
    </div>
  );
}
