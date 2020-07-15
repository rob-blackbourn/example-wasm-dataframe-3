import { Wasi } from '@jetblack/wasi-marshalling'

import { DataFrame } from './DataFrame'

import { exampleUnmarshalled } from './example-unmarshalled'
import { exampleMarshalled } from './example-marshalled'

/**
 * 
 * @param {Wasi} wasi The wasi marshaller
 */
export function example (wasi) {
  'operator-overloading enabled'

  DataFrame.init(wasi)

  exampleUnmarshalled()
  exampleMarshalled()
}
