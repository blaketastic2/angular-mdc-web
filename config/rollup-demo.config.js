import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const ROLLUP_GLOBALS = {
  '@angular-mdc/web': 'ng.material',
  'rxjs': 'Rx'
};

export default {
  entry: 'publish-demo/main-aot.js',
  dest: 'publish-demo/dist/build.js',
  format: 'iife',
  sourceMap: true,
  moduleName: 'app',
  plugins: [
    nodeResolve({ jsnext: true, module: true }),
    commonjs({
      include: 'node_modules/rxjs/**',
    })
  ],
  onwarn: function(warning) {
    // Suppress known error message caused by TypeScript compiled code with Rollup
    // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
    if (warning.code !== 'THIS_IS_UNDEFINED')
      console.log("Rollup warning: ", warning.message);
  }
};
