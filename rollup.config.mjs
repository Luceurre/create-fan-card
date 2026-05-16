import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/create-fan-card.ts',
  output: {
    file: 'create-fan-card.js',
    format: 'es',
    sourcemap: true,
  },
  plugins: [resolve(), typescript(), terser()],
};
