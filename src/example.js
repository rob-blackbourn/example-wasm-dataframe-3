import { Wasi } from '@jetblack/wasi-marshalling'

import { Series } from './Series'
import { DataFrame } from './DataFrame'

/**
 * 
 * @param {Wasi} wasi The wasi marshaller
 */
export function example (wasi) {
  'operator-overloading enabled'

  Series.wasi = wasi

  const u1 = new Series('u1', [1, 2, 3, 4])
  const u2 = new Series('u2', [5, 6, 7, 8])
  const u3 = u1 + u2
  console.log(u3.toString())

  const s1 = Series.from('s1', [1, 2, 3, 4], Float64Array)
  const s2 = Series.from('s2', [5, 6, 7, 8], Float64Array)
  const s3 = s1 + s2
  console.log(s3.toString())

  const slog = s2.log()
  console.log(slog.toString())

  const height = Series.from('height', [1.82, 1.72, 1.64, 1.88], Float64Array)
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

  const weight = Series.from('weight', [81.4, 72.3, 69.9, 79.5], Float64Array)
  const ratio = weight / height
  console.log(ratio.toString())

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
