import { ESLint } from "eslint";
import { quote } from "shell-quote";

const eslint = new ESLint();
const isWin = process.platform === "win32";

/**
 * @param {string[]} str
 * @returns
 */
const escapeStr = (str) => {
  const escaped = quote(str);
  return escaped.replace(/\\@/g, "@");
};

/**
 * @type {Record<
 *   string,
 *   (filenames: string[]) => string | string[] | Promise<string | string[]>
 * >}
 */
const lintStagedConfig = {
  "**/*.{js,jsx,cjs,mjs,ts,tsx}": (filenames) => {
    const escapedFileNames = filenames
      .map((filename) => (isWin ? filename : escapeStr([filename])))
      .join(" ");
    return [
      `eslint --fix ${filenames
        .filter(async (file) => !(await eslint.isPathIgnored(file)))
        .map((f) => `"${f}"`)
        .join(" ")}`,
      `pnpm format ${escapedFileNames}`,
      `git add ${escapedFileNames}`,
    ];
  },
  "**/*.{json,md,mdx,css,html,yml,yaml,scss}": (filenames) => {
    const escapedFileNames = filenames
      .map((filename) => (isWin ? filename : escapeStr([filename])))
      .join(" ");
    return [`pnpm format ${escapedFileNames}`, `git add ${escapedFileNames}`];
  },
};

export default lintStagedConfig;
