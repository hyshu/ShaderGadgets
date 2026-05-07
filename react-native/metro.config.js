const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const appNodeModules = path.resolve(projectRoot, "node_modules");
const sharedTsRoot = path.resolve(projectRoot, "../shared-ts");

const config = getDefaultConfig(projectRoot, { isCSSEnabled: true });

config.watchFolders = [sharedTsRoot];
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  typegpu: path.resolve(projectRoot, "node_modules/typegpu"),
};
config.resolver.nodeModulesPaths = [appNodeModules];

module.exports = config;
