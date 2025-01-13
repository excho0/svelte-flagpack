import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import svg from 'rollup-plugin-svg';
import commonjs from '@rollup/plugin-commonjs';
import sveltePreprocess from 'svelte-preprocess';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import minify from 'rollup-plugin-babel-minify';
import replace from '@rollup/plugin-replace';

const pkg = require('./package.json');

const dev = 'development';
const prod = 'production';
const env = process.env.NODE_ENV === prod || process.env.NODE_ENV === dev ? process.env.NODE_ENV : dev;

const plugins = [
  svelte({
    emitCss: true,
    preprocess: sveltePreprocess({
      scss: {
        implementation: require('sass'),
      },
    }),
  }),
  replace({
    'process.env.NODE_ENV': JSON.stringify(env),
    preventAssignment: true, // Required for modern Rollup plugins
  }),
  svg({ base64: true }),
  dynamicImportVars(),
  resolve(),
  commonjs(),
];

if (env === prod) {
  plugins.push(minify());
}

export default {
  input: 'src/index.js', // Entry point
  output: [
    {
      file: 'dist/index.mjs',
      format: 'es',
      inlineDynamicImports: true,
    },
    {
      file: 'dist/index.js',
      format: 'iife',
      name: 'Flag',
      inlineDynamicImports: true,
    },
  ],
  plugins,
};
