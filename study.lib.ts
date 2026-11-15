const pos = (...n: number[]): void => {
  if (n.some((x) => !Number.isFinite(x) || x <= 0)) throw new RangeError("Values must be positive numbers.");
};

/** Digits a and b with decade multiplier exponent, e.g. yellow-violet-red = [4, 7, 2] = 4700 ohms. */
export const resistorFromBands = ([a, b, mult]: readonly [number, number, number]): number => (a * 10 + b) * 10 ** mult;

export function ledResistor(vSupply: number, vForward: number, mA: number): number {
  pos(vSupply, vForward, mA);
  if (vSupply <= vForward) throw new RangeError("Supply must exceed the LED forward voltage.");
  return (vSupply - vForward) / (mA / 1000);
}

export function divider(vIn: number, r1: number, r2: number): number {
  pos(r1, r2);
  return (vIn * r2) / (r1 + r2);
}

export function rcCutoffHz(r: number, c: number): number {
  pos(r, c);
  return 1 / (2 * Math.PI * r * c);
}

export function astable555(r1: number, r2: number, c: number): { hz: number; duty: number } {
  pos(r1, r2, c);
  return { hz: 1.44 / ((r1 + 2 * r2) * c), duty: (r1 + r2) / (r1 + 2 * r2) };
}

export type Grade = 0 | 1 | 2 | 3 | 4 | 5;
export type CardState = { ease: number; intervalDays: number; reps: number };

/** SM-2 spaced repetition: grades below 3 restart the card without changing its ease. */
export function sm2(c: CardState, grade: Grade): CardState {
  if (grade < 3) return { ease: c.ease, reps: 0, intervalDays: 1 };
  const ease = Math.max(1.3, c.ease + 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  const reps = c.reps + 1;
  const intervalDays = reps === 1 ? 1 : reps === 2 ? 6 : Math.round(c.intervalDays * ease);
  return { ease, reps, intervalDays };
}
