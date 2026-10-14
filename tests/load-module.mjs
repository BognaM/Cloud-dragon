// The app's scripts are browser modules and the project has no package.json,
// so Node can't import them directly. This loads one as a data: URL, with its
// own "./file.js" imports loaded the same way.

import { readFile } from "node:fs/promises";

async function asDataUrl(fileUrl) {
  let source = await readFile(fileUrl, "utf8");
  for (const [statement, path] of source.matchAll(/from "(\.\/[\w-]+\.js)"/g)) {
    const inner = await asDataUrl(new URL(path, fileUrl));
    source = source.replace(statement, `from "${inner}"`);
  }
  return `data:text/javascript,${encodeURIComponent(source)}`;
}

// e.g. await loadModule("js/crisis-detect.js")
export async function loadModule(projectPath) {
  return import(await asDataUrl(new URL(`../${projectPath}`, import.meta.url)));
}
