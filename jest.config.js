export default {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"], // Optional setup
  transform: {
    "^.+\\.jsx?$": "babel-jest", // Use babel-jest for transforming files
    "^.+\\.tsx?$": "ts-jest", // Use ts-jest for TypeScript (if needed)
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // Support for aliasing (e.g., @/components)
  },
};
