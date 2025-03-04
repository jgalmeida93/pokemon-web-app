import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig: Config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.mjs"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/src/components/$1",
    "^@/pages/(.*)$": "<rootDir>/src/pages/$1",
  },
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
};

export default createJestConfig(customJestConfig);
