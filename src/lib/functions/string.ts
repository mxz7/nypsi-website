export function pluralize(s: string, n: number, p?: string) {
  if (n === 1) {
    return s;
  } else {
    if (p) {
      return p;
    } else {
      return s + "s";
    }
  }
}

export function formatNumberPretty(number: number): string {
  let out: string;
  if (number >= 1e12) {
    out = (number / 1e12).toFixed(1) + "t";
  } else if (number >= 1e9) {
    out = (number / 1e9).toFixed(1) + "b";
  } else if (number >= 1e6) {
    out = (number / 1e6).toFixed(1) + "m";
  } else if (number >= 1e3) {
    out = (number / 1e3).toFixed(1) + "k";
  } else {
    return number.toString();
  }

  return out.replace(".0", "");
}
