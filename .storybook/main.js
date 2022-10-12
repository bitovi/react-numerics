// .storybook/main.js|cjs|ts
module.exports = {
  stories: [
    "../libs/react-numerics/src/lib/**/*.stories.mdx",
    "../libs/react-numerics/src/lib/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  core: {
    builder: "@storybook/builder-vite",
  },
}
