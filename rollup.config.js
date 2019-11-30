import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import copy from 'rollup-plugin-copy';

export default {
  input: 'src/lib/flowy.js',
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
  plugins: [
    postcss(),
    htmlTemplate({
      template: 'src/app/index.html',
      target: 'dist/index.html'
    }),
    copy({
      targets: [
        {
          src: 'src/app/{assets,main.js,styles.css}',
          dest: 'dist'
        }
      ]
    })
  ]
};
