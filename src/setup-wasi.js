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

function registerUnmarshalledFunctions(wasi) {
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

export async function setupWasi (fileName, envVars) {
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

  registerUnmarshalledFunctions(wasi)
  registerInt32Functions(wasi)
  registerFloat64Functions(wasi)

  return wasi
}
