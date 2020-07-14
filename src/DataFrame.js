import { Wasi } from '@jetblack/wasi-marshalling'

import { Series } from './Series'

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
   * Create a data frame from an object
   * @param {Array<object>} data The data
   * @param {object} types The types
   * @param {Wasi} wasi The wasi marshaller
   */
  static fromObject (data, types, wasi) {
    const series = {}
    for (let i = 0; i < data.length; i++) {
      for (const column in data[i]) {
        if (!(column in series)) {
          const typedArrayType = types[column]
          const array = typedArrayType === Array
            ? new Array(data.length)
            : wasi.memoryManager.createTypedArray(typedArrayType, data.length)
          series[column] = new Series(column, array, wasi)
        }
        series[column][i] = data[i][column]
      }
    }
    const seriesList = Object.values(series)
    return new DataFrame(seriesList)
  }

  toString () {
    const columns = Object.getOwnPropertyNames(this.series)
    let s = columns.join(', ') + '\n'
    const maxLength = Object.values(this.series)
      .map(x => x.length)
      .reduce((accumulator, currentValue) => Math.max(accumulator, currentValue), 0)
    for (let i = 0; i < maxLength; i++) {
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
