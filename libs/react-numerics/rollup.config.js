const nxConfig = require("@nrwl/react/plugins/bundle-rollup");

module.exports = (...args) => {
  console.log("ROLLUP[libs/react-numerics/rollup.config.js]: enter.");

  const nextConfig = nxConfig(...args);

  // We want the package to include a source map to make it easier to debug.
  nextConfig.output = nextConfig.output || {};
  nextConfig.output.sourcemap = true;

  console.log("ROLLUP[libs/ui-shared/rollup.config.js]: exit.");
  return nextConfig;
};
