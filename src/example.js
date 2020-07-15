import { Wasi } from '@jetblack/wasi-marshalling'

import { Series } from './Series'

import { exampleUnmarshalled } from './example-unmarshalled'
import { exampleMarshalled } from './example-marshalled'

/**
 * 
 * @param {Wasi} wasi The wasi marshaller
 */
export function example (wasi) {
  'operator-overloading enabled'

  Series.wasi = wasi

  exampleUnmarshalled()
  exampleMarshalled()
}
