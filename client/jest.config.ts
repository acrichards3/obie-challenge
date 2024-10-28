import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    setupFilesAfterEnv: ["<rootDir>/test/setupTests.ts"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    moduleNameMapper: {
        "\\.(css|scss)$": "identity-obj-proxy",
        "^~/(.*)$": "<rootDir>/src/$1",
    },
    testEnvironment: "jest-environment-jsdom",
};

export default config;
