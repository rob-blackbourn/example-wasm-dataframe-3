import { Series } from './Series'
import { DataFrame } from './DataFrame'


export function exampleMarshalled () {
  'operator-overloading enabled'

  // We can create series which share arrays with the WebAssembly instance by
  // using a typed array.
  const s1 = Series.from('s1', [1, 2, 3, 4], Float64Array)
  const s2 = Series.from('s2', [5, 6, 7, 8], Float64Array)
  // This calculation will be performed in the WebAssembly instance.
  const s3 = s1 + s2
  console.log(s3.toString())

  // We can call functions of series that have been registered.
  const slog = s2.log()
  console.log(slog.toString())

  // Unary operators are supported.
  const height = Series.from('height', [1.82, 1.72, 1.64, 1.88], Float64Array)
  console.log(height.toString())
  const minusHeight = -height
  console.log(minusHeight.toString())

  // We can register arbitrary functions that run in javascript using the shared
  // arrays.
  Series.registerFunction(
    Symbol.for('**'),
    null,
    (lhs, rhs, length) => lhs.map((value, index) => value ** rhs))
  const sqrHeight = height ** 2
  console.log(sqrHeight.toString())

  const weight = Series.from('weight', [81.4, 72.3, 69.9, 79.5], Float64Array)
  const ratio = weight / height
  console.log(ratio.toString())

  // We can create a data frame with a mix of plain arrays and typed arrays
  const df = DataFrame.fromObject(
    [
      { col0: 'a', col1: 5, col2: 8.1 },
      { col0: 'b', col1: 6, col2: 3.2 }
    ],
    { col0: Array, col1: Int32Array, col2: Float64Array}
  )
  console.log(df.toString())

  // We can do series calculations that are executed in the WebAssembly instance.
  // Note how we turn the first series into doubles. We could have registered a
  // function to handle adding an array of ints to an array of doubles instead.
  df['col3'] = df['col1'].toDouble() + df['col2']
  console.log(df.toString())
}
