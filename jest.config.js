module.exports = {
    preset: "ts-jest",
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    testMatch: ["**/src/**/?(*.)+(spec|test).[jt]s?(x)"],
};
