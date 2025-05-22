import fg from "fast-glob";
import { readFile, writeFile } from "node:fs/promises";

async function main() {
  const files = await fg("src/routes/docs/**/**.md");

  let output: string[] = [];

  for (const file of files) {
    const content = await readFile(file).then((r) => r.toString());

    const strippedJs = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

    const lines = strippedJs.split("\n");

    for (const line of lines) {
      if (line.match(/<DocsTemplate\b[^>]*\btitle=(['"])[^'"]*\1[^>]*\/>/)) {
        const title = line.match(/title=(['"])(.*?)\1/);

        lines[lines.indexOf(line)] = `# ${title[2]}`;
      } else if (
        line.match(
          /<DocsHeader\b(?=[^>]*\bheader=(['"]).*?\1)(?=[^>]*\btext=(['"]).*?\2)[^>]*?(?:\s+\banchor=(['"]).*?\3)?[^>]*\/>/,
        )
      ) {
        const header = line.match(/header=(['"])(.*?)\1/);
        const text = line.match(/text=(['"])(.*?)\1/);

        const newLine = `${new Array(parseInt(header[2].substring(1))).fill("#").join("")} ${text[2]}`;

        lines[lines.indexOf(line)] = newLine;
      }
    }

    const newContent = lines.join("\n").trim();

    output.push(newContent);
  }

  await writeFile("static/llms.txt", output.join("\n"));
}

main();
