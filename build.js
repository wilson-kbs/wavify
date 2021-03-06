const fs = require('fs');
const { rollup } = require('rollup');
const { minify } = require('uglify-js');
const commonjs = require('@rollup/plugin-commonjs');
const pretty = require('pretty-bytes');
const sizer = require('gzip-size');
const pkg = require('./package');

const umd = pkg['umd:main'];
const date = new Date();

const banner = `/*
 * wavify v${pkg.version}
 * (c) ${date.getFullYear()} Wilson Kabalisa
 * Released under the MIT license
 * https://github.com/wilson-kbs/wavify
 */
`;

console.info('Compiling... 😤');

rollup({
  input: 'src/index.ts',
  plugins: [
    commonjs({ defaultIsModuleExports: false }),
    require('@rollup/plugin-typescript')({ module: 'esnext' }),
    require('rollup-plugin-buble')({
      transforms: {
        modules: false,
        dangerousForOf: true
      },
      targets: {
        firefox: 32,
        chrome: 24,
        safari: 6,
        opera: 15,
        edge: 10,
        ie: 10
      }
    }),
    require('@rollup/plugin-node-resolve').default({
      moduleDirectory: 'node_modules'
    })
  ]
}).then(bun => {
  bun.write({
    banner,
    file: umd,
    format: 'umd',
    name: pkg['umd:name'],
    exports: 'named',
    esModule: true,
  }).then(_ => {
    const data = fs.readFileSync(umd, 'utf8');

    // produce minified output
    const { code } = minify(data);
    fs.writeFileSync(umd, `${banner}\n${code}`); // with banner

    // output gzip size
    const int = sizer.sync(code);
    console.info('Compilation was a success! 👍');
    console.info(`~> gzip size: ${pretty(int)}`);
  }).catch(console.error);
}).catch(console.error);