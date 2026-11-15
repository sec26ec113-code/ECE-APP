import { describe, expect, it } from "vitest";
import { astable555, divider, ledResistor, resistorFromBands, sm2 } from "./study.lib";

describe("study.lib", () => {
  it("decodes yellow-violet-red as 4.7k", () => expect(resistorFromBands([4, 7, 2])).toBe(4700));
  it("sizes an LED resistor", () => expect(ledResistor(5, 2, 20)).toBeCloseTo(150));
  it("splits voltage evenly", () => expect(divider(10, 1000, 1000)).toBe(5));
  it("rejects zero capacitance", () => expect(() => astable555(1000, 1000, 0)).toThrow(RangeError));
  it("restarts a lapsed card", () => expect(sm2({ ease: 2.5, intervalDays: 6, reps: 2 }, 1).reps).toBe(0));
  it("stretches a strong recall", () => expect(sm2({ ease: 2.5, intervalDays: 6, reps: 2 }, 5).intervalDays).toBe(16));
});
