import { terser } from 'rollup-plugin-terser';

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
  ]
};
