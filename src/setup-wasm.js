import fs from 'fs'

import arrayMethods from './array-methods'
import { WasmFunctionManager } from './WasmFunctionManager'

function chooseBestType(lhsType, rhsType) {
  if (lhsType === 'int' && rhsType == 'int') {
    return 'int'
  } else if (
    (lhsType === 'int' && rhsType === 'double') || 
    (lhsType === 'double' && rhsType === 'int')) {
    return 'double'
  } else {
    return 'object'
  }
}

function makeBinaryOperation(wasmFunctionManager, intFunc, doubleFunc, defaultFunc) {
  return (lhs, rhs) => {
    const bestType = chooseBestType(lhs.type, rhs.type)

    if (bestType === 'int') {
      const result =  wasmFunctionManager.invokeBinaryFunction(
        intFunc,
        lhs.array,
        rhs.array,
        Int32Array
      )
      return [result, bestType]
    } else if (bestType === 'double') {
      const result = wasmFunctionManager.invokeBinaryFunction(
        doubleFunc,
        lhs.array,
        rhs.array,
        Float64Array
      )
      return [result, bestType]
    } else {
      const result = defaultFunc(lhs, rhs)
      return [result, bestType]
    }
  }
}

function makeUnaryOperation(wasmFunctionManager, intFunc, doubleFunc, defaultFunc) {
  return (series) => {

    if (series.type === 'int' && intFunc != null) {
      const result = wasmFunctionManager.invokeUnaryFunction(
        intFunc,
        series.array,
        Int32Array
      )
      return [result, series.type]
    } else if ((series.type === 'double' || series.type === 'int') && doubleFunc != null) {
      const result = wasmFunctionManager.invokeUnaryFunction(
        doubleFunc,
        series.array,
        Float64Array
      )
      return [result, series.type]
    } else {
      const result = defaultFunc(series)
      return [result, series.type]
    }
  }
}

export async function setupWasm () {
  // Read the wasm file.
  const buf = fs.readFileSync('./src-wasm/data-frame.wasm')

  // Instantiate the wasm module.
  const res = await WebAssembly.instantiate(buf, {})

  // Get the memory exports from the wasm instance.
  const {
    memory,
    malloc,
    free,

    addInt32Arrays,
    subtractInt32Arrays,
    multiplyInt32Arrays,
    divideInt32Arrays,
    negateInt32Array,

    addFloat64Arrays,
    subtractFloat64Arrays,
    multiplyFloat64Arrays,
    divideFloat64Arrays,
    negateFloat64Array,
    logFloat64Array

  } = res.instance.exports
  
  const wasmFunctionManager = new WasmFunctionManager(memory, malloc, free)

  arrayMethods.set(
    Symbol.for('+'),
    makeBinaryOperation(
      wasmFunctionManager,
      addInt32Arrays,
      addFloat64Arrays,
      (lhs, rhs) => lhs.array.map((value, index) => value + rhs.array[index])
    )
  )

  arrayMethods.set(
    Symbol.for('-'),
    makeBinaryOperation(
      wasmFunctionManager,
      subtractInt32Arrays,
      subtractFloat64Arrays,
      (lhs, rhs) => lhs.array.map((value, index) => value - rhs.array[index])
    )
  )

  arrayMethods.set(
    Symbol.for('*'),
    makeBinaryOperation(
      wasmFunctionManager,
      multiplyInt32Arrays,
      multiplyFloat64Arrays,
      (lhs, rhs) => lhs.array.map((value, index) => value * rhs.array[index])
    )
  )

  arrayMethods.set(
    Symbol.for('/'),
    makeBinaryOperation(
      wasmFunctionManager,
      divideInt32Arrays,
      divideFloat64Arrays,
      (lhs, rhs) => lhs.array.map((value, index) => value / rhs.array[index])
    )
  )

  arrayMethods.set(
    Symbol.for('minus'),
    makeUnaryOperation(
      wasmFunctionManager,
      negateInt32Array,
      negateFloat64Array,
      (series) => series.array.map(value => -value)
    )
  ) 

  arrayMethods.set(
    'log',
    makeUnaryOperation(
      wasmFunctionManager,
      null,
      logFloat64Array,
      (series) => series.array.map(value => Math.log(value))
    )
  ) 
}
