import resolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';

const globals = {
  '@angular/core': 'ng.core',
  '@angular/common': 'ng.common',
  'rxjs': 'rxjs',
  'rxjs/operators': 'rxjs.operators'
};

export default {
  external: Object.keys(globals),
  plugins: [resolve(), sourcemaps()],
  onwarn: () => null,
  output: {
    format: 'umd',
    name: 'ng.ngxUiScroll',
    globals,
    sourcemap: true,
    exports: 'named',
    amd: { id: 'ngx-ui-scroll' }
  }
};
