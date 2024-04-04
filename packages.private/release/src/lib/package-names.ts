import fs from "node:fs";
import path from "node:path";
import { load } from "js-yaml";
import { minimatch } from "minimatch";
import { globSync } from "glob";

const potentialWorkspaces = globSync("**/package.json", {
  absolute: false,
  ignore: ["node_modules/**"],
  nodir: true,
}).map((e) => path.dirname(e));

const workspacesGlob = (load(fs.readFileSync("pnpm-workspace.yaml", "utf-8")) as { packages: string[] }).packages;

export const packageNames = minimatch.match(potentialWorkspaces, `{${workspacesGlob.join(",")}}`);
