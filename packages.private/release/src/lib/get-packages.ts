import fs from "node:fs";
import { load } from "js-yaml";
import { minimatch } from "minimatch";

const workspaces = (load(fs.readFileSync("pnpm-workspace.yaml", "utf-8")) as { packages: string[] }).packages;

export const getPackages = (potentialWorkspaces: string[]) => minimatch.match(potentialWorkspaces, `{${workspaces.join(",")}}`);
