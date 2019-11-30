import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import copy from 'rollup-plugin-copy';
import generatePackageJson from 'rollup-plugin-generate-package-json';

const outputDir = process.env.OUTPUT || 'dist';

export default {
  input: 'src/lib/flowy.js',
  output: [
    {
      file: `${outputDir}/flowy.js`,
      format: 'cjs'
    },
    {
      file: `${outputDir}/flowy.min.js`,
      format: 'iife',
      name: 'flowy',
      plugins: [terser()]
    }
  ],
  plugins: [
    generatePackageJson({
      baseContents: pkg => ({
        name: pkg.name,
        main: pkg.main,
        version: pkg.version,
        description: pkg.description,
        author: pkg.author,
        license: pkg.license,
        repository: pkg.repository,
        keywords: pkg.keywords,
        bugs: pkg.bugs,
        homepage: pkg.homepage
      })
    }),
    postcss(),
    htmlTemplate({
      template: 'src/app/index.html',
      target: `${outputDir}/index.html`
    }),
    copy({
      targets: [
        {
          src: 'README.md',
          dest: outputDir
        },
        {
          src: 'src/app/{assets,main.js,styles.css}',
          dest: outputDir
        }
      ]
    })
  ]
};
