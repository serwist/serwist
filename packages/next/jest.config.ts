import type { Config } from "jest";
// eslint-disable-next-line
// @ts-ignore Jest doesn't cope well with Next's types
import nextJest from "next/jest";

const createJestConfig = nextJest();

// Add any custom config to be passed to Jest
const customJestConfig: Config = {
  testMatch: ["**/*.test.js", "**/*.test.ts", "**/*.test.tsx"],
  verbose: true,
  rootDir: "__tests__",
  moduleDirectories: ["node_modules", "<rootDir>/"],
  setupFilesAfterEnv: ["<rootDir>/jest-setup-after-env.ts"],
};

export default createJestConfig(customJestConfig);
