import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/flowy.js',
  output: [
    {
      file: 'dist/flowy.js',
      format: 'cjs'
    },
    {
      file: 'dist/flowy.min.js',
      format: 'iife',
      name: 'flowy',
      plugins: [terser()]
    }
  ],
  plugins: [postcss()]
};
