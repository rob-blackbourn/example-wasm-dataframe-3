import fs from 'fs'
import {
  Wasi,
  TypedArrayType,
  Uint32Type,
  Float64Type,
  FunctionPrototype,
  In
} from '@jetblack/wasi-marshalling'

import { registerUnmarshalledFunctions } from './register-unmarshalled-functions'
import { registerInt32Functions } from './register-int32-functions'
import { registerFloat64Functions } from './register-float64-functions'

export async function setupWasi (fileName, envVars) {
  // Read the wasm file.
  const buf = fs.readFileSync(fileName)

  // Create the Wasi instance passing in environment variables.
  const wasi = new Wasi(envVars)

  // Instantiate the wasm module.
  const res = await WebAssembly.instantiate(buf, {
    wasi_snapshot_preview1: wasi.imports()
  })

  // Initialise the wasi instance
  wasi.init(res.instance)

  registerUnmarshalledFunctions(wasi)
  registerInt32Functions(wasi)
  registerFloat64Functions(wasi)

  return wasi
}
