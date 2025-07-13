const esbuild = require('esbuild');
const path = require('path');

// Create a banner to include at the top of the bundled file
const banner = `/**
 * WebJS v${require('./package.json').version}
 * Includes RegistryJS
 * ${new Date().toISOString()}
 */
`;

// Build configuration
const buildOptions = {
  entryPoints: ['./web.js'],
  bundle: true,
  minify: true,
  sourcemap: true,
  outfile: './dist/web.bundle.js',
  banner: {
    js: banner,
  },
  // Make sure to include the node_modules path for resolving the registryjs package
  nodePaths: [path.join(__dirname, 'node_modules')],
  // Define the global variable name that will be exposed
  globalName: 'WebJS',
  // Keep the IIFE format for browser compatibility
  format: 'iife',
  // Make sure the bundle works in the browser
  platform: 'browser',
  target: ['es2015'],
  // Externalize any Node.js built-ins that might be used
  external: ['fs', 'path', 'os'],
};

// Run the build
async function build() {
  try {
    await esbuild.build(buildOptions);
    console.log('Build completed successfully');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
