// .storybook/main.js|cjs|ts
module.exports = {
  stories: [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: ["@storybook/addon-essentials"],
  core: {
    builder: "@storybook/builder-vite",
  },
}
