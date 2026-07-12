module.exports = {
    testEnvironment: "node",

    setupFilesAfterEnv: ["<rootDir>/test/setup.js"],

    testTimeout: 30000,

    collectCoverage: true,

    coverageDirectory: "coverage",

    coveragePathIgnorePatterns: [
        "/node_modules/",
    ],
};