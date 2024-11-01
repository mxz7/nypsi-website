import { sort } from "fast-sort";

export const prerender = true;

const pathsRaw = Object.keys(import.meta.glob("./**/*.md")).map((i) => i.replace("./", ""));

const folders = pathsRaw.filter((i) => i.split("/").length > 2);

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
      path: `/docs/${parent ? `${parent}/${name}` : name}`,
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

  func(path, pathsData);
}

export function load() {
  const paths = sort(Object.values(pathsData)).asc([(i) => Boolean(i.children), (i) => i.name]);

  console.log(paths[7]);

  return {
    paths,
  };
}
