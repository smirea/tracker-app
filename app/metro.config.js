const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(__dirname, '..');

const config = getDefaultConfig(projectRoot);

// Watch the shared db folder in the parent directory
config.watchFolders = [workspaceRoot];

// Allow importing from parent directory
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Add .sql extension for Drizzle migrations
config.resolver.sourceExts.push('sql');

module.exports = withNativeWind(config, { input: './global.css' });
