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
