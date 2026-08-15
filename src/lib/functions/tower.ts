export type TowerCell = "A" | "B" | "C" | "G" | "GC" | "X";

export function parseTowerRows(outcome: string): TowerCell[][] {
  const lines = outcome.trim().split(/\r?\n/);
  const boardStart = lines.findIndex((line) => /\bX\s*=\s*bad click\b/i.test(line));

  if (boardStart === -1) return [];

  return lines
    .slice(boardStart + 1)
    .map((row) => row.toUpperCase().match(/GC|[ABCGX]/g) as TowerCell[] | null)
    .filter((row): row is TowerCell[] => row !== null && row.length > 0);
}
