/* eslint-disable */
export default {
  displayName: "react-numerics",
  preset: "../../jest.preset.js",
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest"
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory: "../../coverage/libs/react-numerics",
  setupFilesAfterEnv: ["./jest.setup.ts"]
};
