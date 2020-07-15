import { Wasi } from '@jetblack/wasi-marshalling'

import { DataFrame } from './DataFrame'

import { exampleUnmarshalled } from './example-unmarshalled'
import { exampleMarshalled } from './example-marshalled'

/**
 * Run the examples.
 * @param {Wasi} wasi The wasi marshaller
 */
export function example (wasi) {
  'operator-overloading enabled'

  // The data frame must be initialized with the WebAssembly instance and
  // support code.
  DataFrame.init(wasi)

  // Run the examples.
  exampleUnmarshalled()
  exampleMarshalled()
}
