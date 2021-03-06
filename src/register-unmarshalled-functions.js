export function registerUnmarshalledFunctions(wasi) {
  wasi.registerFunction(
    Symbol.for('+'),
    null,
    (a, b, length) => a.map((x, i) => x + b[i])
  )

  wasi.registerFunction(
    Symbol.for('-'),
    null,
    (a, b, length) => a.map((x, i) => x - b[i])
  )

  wasi.registerFunction(
    Symbol.for('*'),
    null,
    (a, b, length) => a.map((x, i) => x * b[i])
  )

  wasi.registerFunction(
    Symbol.for('/'),
    null,
    (a, b, length) => a.map((x, i) => x / b[i])
  )

  wasi.registerFunction(
    Symbol.for('-'),
    null,
    (a, length) => a.map(x => -x)
  )
}
