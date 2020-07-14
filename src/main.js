import { setupWasi } from './setup-wasi'
import { example } from './example'

async function main () {
  const wasi = await setupWasi('src-wasm/data-frame.wasm')

  example(wasi)
}

main().then(() => console.log('Done')).catch(error => console.error(error))
