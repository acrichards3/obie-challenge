import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

export default {
    preset: "ts-jest",
    transform: {
        "^.+\\.tsx?$": "ts-jest",
        "^.+\\.ts$": "ts-jest",
    },
    extensionsToTreatAsEsm: [".ts", ".tsx"],
    moduleFileExtensions: ["ts", "js", "tsx", "jsx", "json"],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/" }),
};
