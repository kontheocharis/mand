export type Integer = number;

export type Complex = [number, number];

export type Real = number;

export type Interval = number;

export const complex = {
  add: ([a, b]: Complex, [c, d]: Complex): Complex => [a + c, b + d],
  eq: ([a, b]: Complex, [c, d]: Complex): boolean => a === c && b === d,
  sub: ([a, b]: Complex, [c, d]: Complex): Complex => [a - c, b - d],
  mul: ([a, b]: Complex, [c, d]: Complex): Complex => [
    a * c - b * d,
    a * d + b * c,
  ],
  arg: ([a, b]: Complex): Real => Math.atan2(b, a),
  abs: ([a, b]: Complex): Real => Math.sqrt(a * a + b * b),
};
