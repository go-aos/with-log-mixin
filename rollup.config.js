import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'

const env = process.env.NODE_ENV
const config = {
  input: 'src/index.js',
  plugins: []
}

if (env === 'es' || env === 'cjs') {
  config.output = { format: env }
  config.plugins.push(babel({ plugins: ['external-helpers'] }))
}

if (env === 'development' || env === 'production') {
  config.output = { format: 'umd', name: 'WithLogMixin' }
  config.plugins.push(
    nodeResolve({ jsnext: true }),
    babel({ exclude: 'node_modules/**', plugins: ['external-helpers'] }),
    commonjs({
      include: 'node_modules/**',
      namedExports: {}
    }),
    replace({ 'process.env.NODE_ENV': JSON.stringify(env) })
  )
}

if (env === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  )
}

export default config
