import fs from 'fs'
import {
  Wasi,
  TypedArrayType,
  Int32Type,
  Uint32Type,
  Float64Type,
  FunctionPrototype,
  In
} from '@jetblack/wasi-marshalling'

import { Series } from './Series'
import { DataFrame } from './DataFrame'

function registerUnmarshalled(wasi) {
  wasi.registerFunction(
    Symbol.for('+'),
    null,
    (a, b, length) => a.map((x, i) => x + b[i])
  )

}

function registerInt32Functions(wasi) {
  wasi.registerFunction(
    Symbol.for('+'),
    new FunctionPrototype(
      [
        new In(new TypedArrayType(new Int32Type(), null)),
        new In(new TypedArrayType(new Int32Type(), null)),
        new In(new Uint32Type())
      ],
      new TypedArrayType(new Int32Type(), (i, args) => args[2])
    ),
    wasi.instance.exports.addInt32Arrays
  )

  wasi.registerFunction(
    Symbol.for('-'),
    new FunctionPrototype(
      [
        new In(new TypedArrayType(new Int32Type(), null)),
        new In(new TypedArrayType(new Int32Type(), null)),
        new In(new Uint32Type())
      ],
      new TypedArrayType(new Int32Type(), (i, args) => args[2])
    ),
    wasi.instance.exports.subtractInt32Arrays
  )

  wasi.registerFunction(
    Symbol.for('*'),
    new FunctionPrototype(
      [
        new In(new TypedArrayType(new Int32Type(), null)),
        new In(new TypedArrayType(new Int32Type(), null)),
        new In(new Uint32Type())
      ],
      new TypedArrayType(new Int32Type(), (i, args) => args[2])
    ),
    wasi.instance.exports.multiplyInt32Arrays
  )

  wasi.registerFunction(
    Symbol.for('/'),
    new FunctionPrototype(
      [
        new In(new TypedArrayType(new Int32Type(), null)),
        new In(new TypedArrayType(new Int32Type(), null)),
        new In(new Uint32Type())
      ],
      new TypedArrayType(new Int32Type(), (i, args) => args[2])
    ),
    wasi.instance.exports.divideInt32Arrays
  )

  wasi.registerFunction(
    Symbol.for('-'),
    new FunctionPrototype(
      [
        new In(new TypedArrayType(new Int32Type(), null)),
        new In(new Uint32Type())
      ],
      new TypedArrayType(new Int32Type(), (i, args) => args[1])
    ),
    wasi.instance.exports.negateInt32Arrays
  )

  wasi.registerFunction(
    "toDouble",
    new FunctionPrototype(
      [
        new In(new TypedArrayType(new Int32Type(), null)),
        new In(new Uint32Type())
      ],
      new TypedArrayType(new Float64Type(), (i, args) => args[1])
    ),
    wasi.instance.exports.toDouble
  )
}

function registerFloat64Functions(wasi) {
  wasi.registerFunction(
    Symbol.for('+'),
    new FunctionPrototype(
      [
        new In(new TypedArrayType(new Float64Type(), null)),
        new In(new TypedArrayType(new Float64Type(), null)),
        new In(new Uint32Type())
      ],
      new TypedArrayType(new Float64Type(), (i, args) => args[2])
    ),
    wasi.instance.exports.addFloat64Arrays
  )

  wasi.registerFunction(
    Symbol.for('-'),
    new FunctionPrototype(
      [
        new In(new TypedArrayType(new Float64Type(), null)),
        new In(new TypedArrayType(new Float64Type(), null)),
        new In(new Uint32Type())
      ],
      new TypedArrayType(new Float64Type(), (i, args) => args[2])
    ),
    wasi.instance.exports.subtractFloat64Arrays
  )

  wasi.registerFunction(
    Symbol.for('*'),
    new FunctionPrototype(
      [
        new In(new TypedArrayType(new Float64Type(), null)),
        new In(new TypedArrayType(new Float64Type(), null)),
        new In(new Uint32Type())
      ],
      new TypedArrayType(new Float64Type(), (i, args) => args[2])
    ),
    wasi.instance.exports.multiplyFloat64Arrays
  )

  wasi.registerFunction(
    Symbol.for('/'),
    new FunctionPrototype(
      [
        new In(new TypedArrayType(new Float64Type(), null)),
        new In(new TypedArrayType(new Float64Type(), null)),
        new In(new Uint32Type())
      ],
      new TypedArrayType(new Float64Type(), (i, args) => args[2])
    ),
    wasi.instance.exports.divideFloat64Arrays
  )

  wasi.registerFunction(
    "log",
    new FunctionPrototype(
      [
        new In(new TypedArrayType(new Float64Type(), null)),
        new In(new Uint32Type())
      ],
      new TypedArrayType(new Float64Type(), (i, args) => args[1])
    ),
    wasi.instance.exports.logFloat64Array
  )

  wasi.registerFunction(
    Symbol.for("minus"),
    new FunctionPrototype(
      [
        new In(new TypedArrayType(new Float64Type(), null)),
        new In(new Uint32Type())
      ],
      new TypedArrayType(new Float64Type(), (i, args) => args[1])
    ),
    wasi.instance.exports.negateFloat64Array
  )
}

async function setupWasi (fileName, envVars) {
  // Read the wasm file.
  const buf = fs.readFileSync(fileName)

  // Create the Wasi instance passing in environment variables.
  const wasi = new Wasi(envVars)

  // Instantiate the wasm module.
  const res = await WebAssembly.instantiate(buf, {
    wasi_snapshot_preview1: wasi.imports()
  })

  // Initialise the wasi instance
  wasi.init(res.instance)

  registerUnmarshalled(wasi)
  registerInt32Functions(wasi)
  registerFloat64Functions(wasi)

  return wasi
}

/**
 * 
 * @param {Wasi} wasi The wasi marshaller
 */
function example (wasi) {
  'operator-overloading enabled'

  const u1 = new Series('u1', [1, 2, 3, 4], wasi)
  const u2 = new Series('u2', [5, 6, 7, 8], wasi)
  const u3 = u1 + u2
  console.log(u3.toString())

  const s1 = new Series('s1', wasi.float64Array([1, 2, 3, 4]), wasi)
  const s2 = new Series('s2', wasi.float64Array([5, 6, 7, 8]), wasi)
  const s3 = s1 + s2
  console.log(s3.toString())

  const slog = s2.log()
  console.log(slog.toString())

  const height = new Series('height', wasi.float64Array([1.82, 1.72, 1.64, 1.88]), wasi)
  console.log(height.toString())

  const minusHeight = -height
  console.log(minusHeight.toString())

  wasi.registerFunction(
    Symbol.for('**'),
    null,
    (lhs, rhs, length) => lhs.map((value, index) => value ** rhs))
  const sqrHeight = height ** 2
  console.log(sqrHeight.toString())

  // arrayMethods.set('max', (lhs) => [[Math.max(...height)], lhs.type])
  // const maxHeight = height.max()
  // console.log(maxHeight.toString())

  const weight = new Series('weight', wasi.float64Array([81.4, 72.3, 69.9, 79.5]), wasi)
  const ratio = weight / height
  console.log(ratio.toString())

  // const s4 = new Series('numbers', [1, 2, 3, 4], 'int')
  // s4.push(5)
  // console.log(s4.toString())

  const df = DataFrame.fromObject(
    [
      { col0: 'a', col1: 5, col2: 8.1 },
      { col0: 'b', col1: 6, col2: 3.2 }
    ],
    { col0: Array, col1: Int32Array, col2: Float64Array},
    wasi
  )
  console.log(df.toString())
  df['col3'] = df['col1'].toDouble() + df['col2']
  console.log(df.toString())
}

async function main () {
  const wasi = await setupWasi('src-wasm/data-frame.wasm')

  example(wasi)
}

main().then(() => console.log('Done')).catch(error => console.error(error))
