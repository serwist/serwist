import type { Config } from "jest";

// Add any custom config to be passed to Jest
const jestConfig = {
  testMatch: ["**/*.test.js", "**/*.test.ts", "**/*.test.tsx"],
  verbose: true,
  moduleDirectories: ["node_modules", "<rootDir>/"],
  setupFilesAfterEnv: ["<rootDir>/jest-setup-after-env.ts"],
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
} satisfies Config;

export default jestConfig;
