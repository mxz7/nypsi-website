import { describe, expect, it } from "vitest";

import { buildDocsTree, paths, pathsRaw } from "../src/lib/data/docs";

describe("buildDocsTree", () => {
  it("builds nested wiki paths and sorts the top level", () => {
    expect(
      buildDocsTree([
        "zeta/+page.md",
        "economy/items/gems/+page.svx",
        "+page.md",
        "alpha/+page.md",
        "economy/items/crates/+page.md",
      ]),
    ).toEqual([
      { name: "alpha", path: "/wiki/alpha" },
      {
        name: "economy",
        path: "/wiki/economy",
        children: {
          items: {
            name: "items",
            path: "/wiki/economy/items",
            children: {
              gems: { name: "gems", path: "/wiki/economy/items/gems" },
              crates: { name: "crates", path: "/wiki/economy/items/crates" },
            },
          },
        },
      },
      { name: "zeta", path: "/wiki/zeta" },
    ]);
  });

  it("ignores Markdown and mdsvex wiki index pages", () => {
    expect(buildDocsTree(["+page.md", "+page.svx"])).toEqual([]);
  });

  it("merges pages that share parent sections", () => {
    const [moderation] = buildDocsTree([
      "moderation/cases/+page.md",
      "moderation/evidence/+page.md",
    ]);

    expect(Object.keys(moderation.children ?? {})).toEqual(["cases", "evidence"]);
  });
});

describe("wiki route discovery", () => {
  it("discovers the real wiki pages and excludes the index from navigation", () => {
    expect(pathsRaw).toContain("+page.md");
    expect(pathsRaw).toContain("economy/items/crates/+page.md");
    expect(paths.some((path) => path.name === "+page.md")).toBe(false);

    const economy = paths.find((path) => path.name === "economy");
    expect(economy?.children?.items.children?.crates.path).toBe("/wiki/economy/items/crates");
  });
});
