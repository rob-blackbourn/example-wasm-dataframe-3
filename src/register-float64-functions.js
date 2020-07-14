import {
  TypedArrayType,
  Uint32Type,
  Float64Type,
  FunctionPrototype,
  In
} from '@jetblack/wasi-marshalling'

export function registerFloat64Functions(wasi) {
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
