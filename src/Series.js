import { Wasi } from '@jetblack/wasi-marshalling'

 /**
 * TypedArray
 * @typedef {Int8Array|Int16Array|Int32Array|BigInt64Array|Uint8Array|Uint16Array|Uint32Array|BigUint64Array|Float32Array|Float64Array} TypedArray
 */

/**
 * TypedArrayType
 * @typedef {Int8ArrayConstructor|Int16ArrayConstructor|Int32ArrayConstructor|BigInt64ArrayConstructor|Uint8ArrayConstructor|Uint16ArrayConstructor|Uint32ArrayConstructor|BigUint64ArrayConstructor|Float32ArrayConstructor|Float64ArrayConstructor} TypedArrayType
 */

/**
 * A series is a named array
 * @template T
 */
export class Series {
  /**
   * Construct a series
   * @param {string} name The name of the series
   * @param {Array<any>} array The data array
   */
  constructor (name, array) {
    this.name = name
    this.array = array

    return new Proxy(this, {
      get: Series.proxyGet,
      set: Series.proxySet,
      apply: Series.proxyApply,
      // construct: Reflect.construct,
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

  /**
   * @property {Wasi} wasi The wasi instance
   */
  static wasi = null

  /**
   * 
   * @param {Series} obj The series
   * @param {string|symbol} prop The property to get
   * @param {Series} receiver The receiver
   */
  static proxyGet(obj, prop, receiver) {
    if (prop in obj) {
      return Reflect.get(obj, prop, receiver)
    } else if (Series.wasi.hasFunction(prop)) {
      return (...args) => {
        const preparedArgs = args.map(x => x instanceof Series ? x.array : x)
        const result = Series.wasi.invoke(prop, obj.array, ...preparedArgs, obj.array.length)
        return new Series('', result)
      }
    } else {
      return Reflect.get(obj.array, prop, receiver.array)
    }
  }

  static proxySet(obj, prop, value, receiver) {
    if (prop in obj) {
      return Reflect.set(obj, prop, value, receiver)
    } else {
      return Reflect.set(obj.array, prop, value, receiver.array)
    }
  }

  static proxyApply(target, thisArgument, argumentList) {
    return Reflect.apply(target, thisArgument, argumentList)
  }

  /**
   * Create a series
   * @param {string} name The series name
   * @param {number|Array<any>} lengthOrArray The length or an array
   * @param {ArrayConstructor|TypedArrayType} arrayType The array type
   * @returns {Series} A new series of the given type
   */
  static from (name, lengthOrArray, arrayType) {
    const array = arrayType instanceof Array
      ? (typeof lengthOrArray === 'number' ? new Array(lengthOrArray) : lengthOrArray)
      : this.wasi.memoryManager.createTypedArray(arrayType, lengthOrArray)
    return new Series(name, array)
  }

  toString () {
    return `(${this.name}): ${this.array.join(', ')}`
  }
}
