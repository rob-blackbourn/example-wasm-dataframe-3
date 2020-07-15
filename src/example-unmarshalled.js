import { Series } from './Series'
import { DataFrame } from './DataFrame'

export function exampleUnmarshalled () {
  'operator-overloading enabled'

  const u1 = new Series('u1', [1, 2, 3, 4])
  const u2 = new Series('u2', [5, 6, 7, 8])
  const u3 = u1 + u2
  console.log(u3.toString())

  const df = DataFrame.fromObject(
    [
      { col0: 'a', col1: 5, col2: 8.1 },
      { col0: 'b', col1: 6, col2: 3.2 }
    ],
    { col0: Array, col1: Array, col2: Array}
  )
  console.log(df.toString())
  df['col3'] = df['col1'] + df['col2']
  console.log(df.toString())

}
