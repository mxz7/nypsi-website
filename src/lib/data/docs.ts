import { sort } from "fast-sort";

export const pathsRaw = Object.keys(import.meta.glob("../../routes/wiki/**/*.{md,svx}")).map((i) =>
  i.replace("../../routes/wiki/", ""),
);

export interface PathsData {
  [key: string]: { name: string; path: string; children?: PathsData };
}

const pathsData: PathsData = {};

for (const path of pathsRaw) {
  const func = (path: string, node: PathsData, parent?: string) => {
    let hasChildren = path.split("/").length > 2;

    const name = path.split("/")[0];

    if (node[name]) {
      return func(
        path.split("/").slice(1).join("/"),
        node[name].children!,
        parent ? `${parent}/${name}` : name,
      );
    }

    node[name] = {
      name,
      path: `/wiki/${parent ? `${parent}/${name}` : name}`,
      children: hasChildren ? {} : undefined,
    };

    if (hasChildren) {
      func(
        path.split("/").slice(1).join("/"),
        node[name].children!,
        parent ? `${parent}/${name}` : name,
      );
    }
  };

  if (path === "+page.md") continue;

  func(path, pathsData);
}

export const paths = sort(Object.values(pathsData)).asc((i) => i.name);
