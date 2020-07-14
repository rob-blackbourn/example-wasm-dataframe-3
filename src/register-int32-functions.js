import {
  Wasi,
  TypedArrayType,
  Int32Type,
  Uint32Type,
  Float64Type,
  FunctionPrototype,
  In
} from '@jetblack/wasi-marshalling'

export function registerInt32Functions(wasi) {
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
