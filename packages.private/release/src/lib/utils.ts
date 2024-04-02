import fs from "node:fs";
import path from "node:path";
import type { PackageJSON } from "@changesets/types";
import type { Gitlab } from "@gitbeaker/core";
import { glob } from "glob";
import { toString as mdastToString } from "mdast-util-to-string";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { getPackages } from "./get-packages.js";
import type { Package } from "./types.js";

export const BumpLevels = {
  dep: 0,
  patch: 1,
  minor: 2,
  major: 3,
} as const;

export const getVersionsByDirectory = async (cwd: string) => {
  const potentialWorkspaces = await glob("**/package.json", { absolute: false, cwd, ignore: ["node_modules/**"], nodir: true }).then((workspaces) =>
    workspaces.map((e) => path.dirname(e)),
  );
  const packages = getPackages(potentialWorkspaces);
  return new Map(packages.map((x) => [x, getPackageJson(x).version]));
};

export const getBumpedPackages = async (cwd: string, previousVersions: Map<string, string>) => {
  const potentialWorkspaces = await glob("**/package.json", { absolute: false, cwd, ignore: ["node_modules/**"], nodir: true }).then((workspaces) =>
    workspaces.map((e) => path.dirname(e)),
  );
  const packages = getPackages(potentialWorkspaces).map((pkg) => {
    return {
      packageJson: getPackageJson(pkg),
      dir: pkg,
    } satisfies Package;
  });
  const changedPackages = new Set<Package>();

  for (const pkg of packages) {
    const previousVersion = previousVersions.get(pkg.dir);
    if (previousVersion !== pkg.packageJson.version) {
      changedPackages.add(pkg);
    }
  }

  return [...changedPackages];
};

export const getChangelogEntry = (changelog: string, version: string) => {
  const ast = unified().use(remarkParse).parse(changelog);

  let highestLevel: number = BumpLevels.dep;

  const nodes = ast.children;
  let headingStartInfo: { index: number; depth: number } | undefined;
  let endIndex: number | undefined;

  for (const [i, node] of nodes.entries()) {
    if (node.type === "heading") {
      const stringified = mdastToString(node);
      const match = /(major|minor|patch)/.exec(stringified.toLowerCase());
      if (match !== null) {
        const level = BumpLevels[match[0] as "major" | "minor" | "patch"];
        highestLevel = Math.max(level, highestLevel);
      }
      if (headingStartInfo === undefined && stringified === version) {
        headingStartInfo = {
          index: i,
          depth: node.depth,
        };
        continue;
      }
      if (endIndex === undefined && headingStartInfo !== undefined && headingStartInfo.depth === node.depth) {
        endIndex = i;
        break;
      }
    }
  }
  if (headingStartInfo) {
    ast.children = ast.children.slice(headingStartInfo.index + 1, endIndex);
  }
  return {
    content: unified().use(remarkStringify).stringify(ast),
    highestLevel,
  };
};

export const getUsername = async (api: Gitlab) => await api.Users.showCurrentUser().then((currentUser) => currentUser.username);

export const getPackageJson = (pkgPath: string) => JSON.parse(fs.readFileSync(path.join(pkgPath, "package.json"), "utf-8")) as PackageJSON;
