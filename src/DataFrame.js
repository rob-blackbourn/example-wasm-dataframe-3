import { Wasi, FunctionPrototype } from '@jetblack/wasi-marshalling'

import { Series } from './Series'


/**
 * WASM Callback
 * @callback wasmCallback
 * @param {*} args The function arguments
 * @returns {*} The return value if any 
 */

/**
 * TypedArrayType
 * @typedef {Int8ArrayConstructor|Int16ArrayConstructor|Int32ArrayConstructor|BigInt64ArrayConstructor|Uint8ArrayConstructor|Uint16ArrayConstructor|Uint32ArrayConstructor|BigUint64ArrayConstructor|Float32ArrayConstructor|Float64ArrayConstructor} TypedArrayType
 */

export class DataFrame {
  constructor (series) {
    this.series = {}
    for (const item of series) {
      this.series[item.name] = item
    }

    return new Proxy(this, {
      get: DataFrame.proxyGet,
      set: DataFrame.proxySet,
      apply: DataFrame.proxyApply,
      defineProperty: Reflect.defineProperty,
      getOwnPropertyDescriptor: Reflect.getOwnPropertyDescriptor,
      deleteProperty: Reflect.deleteProperty,
      getPrototypeOf: Reflect.getPrototypeOf,
      setPrototypeOf: Reflect.setPrototypeOf,
      isExtensible: Reflect.isExtensible,
      preventExtensions: Reflect.preventExtensions,
      has: Reflect.has,
      ownKeys: Reflect.ownKeys
    })
  }

  static proxyGet(obj, prop, receiver) {
    return prop in obj ? Reflect.get(obj, prop, receiver) : Reflect.get(obj.series, prop, receiver.series)
  }

  static proxySet(obj, prop, value, receiver){
    if (prop in obj) {
      Reflect.set(obj, prop, value, receiver)
    } else {
      value.name = prop
      return Reflect.set(obj.series, prop, value, receiver.series)
    }
  }

  static proxyApply(target, thisArgument, argumentList) {
    return target in thisArgument ? Reflect.apply(target, thisArgument, argumentList) : Reflect.apply(target, thisArgument.array, argumentList)
  }

  /**
   * Initialize the data frame with the marshaller.
   * @param {Wasi} wasi The WASI marshaller
   */
  static init (wasi) {
    Series.init(wasi)
  }

  /**
   * Create a data frame from an object
   * @param {Array<object>} data The data
   * @param {object} types The types
   */
  static fromObject (data, types) {
    const series = {}
    for (let i = 0; i < data.length; i++) {
      for (const column in data[i]) {
        if (!(column in series)) {
          series[column] = Series.from(column, data.length, types[column])
        }
        series[column][i] = data[i][column]
      }
    }
    const seriesList = Object.values(series)
    return new DataFrame(seriesList)
  }

  /**
   * Register a function
   * @param {string|symbol} name The function name
   * @param {FunctionPrototype} prototype The function prototype
   * @param {wasmCallback} callback The wasm callback
   */
  static registerFunction (name, prototype, callback) {
    Series.registerFunction(name, prototype, callback)
  }

  toString () {
    const columns = Object.getOwnPropertyNames(this.series)
    let s = columns.join(', ') + '\n'
    const maxLength = Object.values(this.series)
      .map(x => x.length)
      .reduce((accumulator, currentValue) => Math.max(accumulator, currentValue), 0)
    for (let i = 0; i < maxLength; ++i) {
      const row = []
      for (const column of columns) {
        if (i < this.series[column].length) {
          row.push(this.series[column][i])
        } else {
          row.push(null)
        }
      }
      s += row.join(', ') + '\n'
    }
    return s
  }
}
