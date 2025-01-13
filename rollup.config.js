import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { sveltePreprocess } from 'svelte-preprocess';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import minify from 'rollup-plugin-babel-minify';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import url from '@rollup/plugin-url';
import path from 'path';

const pkg = require('./package.json');

const dev = 'development';
const prod = 'production';
const env = process.env.NODE_ENV === prod || process.env.NODE_ENV === dev ? process.env.NODE_ENV : dev;

const plugins = [
  svelte({
    emitCss: false,
    preprocess: sveltePreprocess({
      typescript: true,
      scss: {
        implementation: require('sass'),
      },
    }),
  }),
  replace({
    'process.env.NODE_ENV': JSON.stringify(env),
    preventAssignment: true,
  }),
  url({
    include: ['**/*.svg'],
    limit: Infinity, // Always inline SVGs as base64
    emitFiles: false, // Do not emit separate files
  }),
  dynamicImportVars(),
  resolve({
    browser: true,
    dedupe: ['svelte'],
  }),
  commonjs(),
  typescript({
    tsconfig: './tsconfig.json',
    sourceMap: !prod,
    inlineSources: !prod,
  }),
];

if (env === prod) {
  plugins.push(minify());
}

export default {
  input: 'src/index.ts', // Ensure this exports the Flag component
  output: [
    {
      file: path.resolve(__dirname, pkg.module),
      format: 'es',
      sourcemap: !prod,
      inlineDynamicImports: true,
    },
    {
      file: path.resolve(__dirname, pkg.main),
      format: 'iife',
      name: 'Flag',
      sourcemap: !prod,
      inlineDynamicImports: true,
    },
  ],
  plugins,
  external: ['svelte'],
};
