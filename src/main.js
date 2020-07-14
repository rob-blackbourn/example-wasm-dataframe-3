import { Wasi } from '@jetblack/wasi-marshalling'

import { setupWasi } from './setup-wasi'
import { Series } from './Series'
import { DataFrame } from './DataFrame'

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
