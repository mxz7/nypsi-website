import { sort } from "fast-sort";

export default function filterOutliers(array: { money: number; amount: number; date: Date }[]) {
  if (array.length < 8) return array;

  let q1: number;
  let q3: number;

  const values = sort(array.slice()).asc((i) => i.money * i.amount); //copy array fast and sort

  if ((values.length / 4) % 1 === 0) {
    //find quartiles
    q1 =
      (1 / 2) *
      (values[values.length / 4].money * values[values.length / 4].amount +
        values[values.length / 4 + 1].money * values[values.length / 4 + 1].amount);
    q3 =
      (1 / 2) *
      (values[values.length * (3 / 4)].money * values[values.length * (3 / 4)].amount +
        values[values.length * (3 / 4) + 1].money * values[values.length * (3 / 4) + 1].amount);
  } else {
    q1 =
      values[Math.floor(values.length / 4 + 1)].money *
      values[Math.floor(values.length / 4 + 1)].amount;
    q3 =
      values[Math.ceil(values.length * (3 / 4) + 1)].money *
      values[Math.ceil(values.length * (3 / 4) + 1)].amount;
  }

  const iqr = q3 - q1;
  const maxValue = q3 + iqr * 1.5;
  const minValue = q1 - iqr * 1.5;

  return values.filter((x) => x.amount * x.money >= minValue && x.amount * x.money <= maxValue);
}
