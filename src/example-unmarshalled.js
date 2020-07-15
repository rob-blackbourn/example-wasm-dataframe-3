import { Series } from './Series'
import { DataFrame } from './DataFrame'

export function exampleUnmarshalled () {
  'operator-overloading enabled'

  // We can create series with plain arrays
  const s1 = new Series('s1', [1, 2, 3, 4])
  const s2 = new Series('s2', [5, 6, 7, 8])
  // The following calculation will be done in the WebAssembly instance. As the
  // type of the series array is Array the calculations will not be performed in
  // the WebAssembly instance.
  const s3 = s1 + s2
  console.log(s3.toString())

  // We can extend the functions available to the series.
  Series.registerFunction(
    Symbol.for('**'),
    null,
    (lhs, rhs, length) => lhs.map((value, index) => value ** rhs))
  const s4 = s1 ** 2
  console.log(s4.toString())

  // We can create a data frame. Note how we pass in the types of the columns.
  const df = DataFrame.fromObject(
    [
      { col0: 'a', col1: 5, col2: 8.1 },
      { col0: 'b', col1: 6, col2: 3.2 }
    ],
    { col0: Array, col1: Array, col2: Array}
  )
  console.log(df.toString())

  // We can do calculations on data frames.
  df['col3'] = df['col1'] + df['col2']
  console.log(df.toString())
}
