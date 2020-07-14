export class WasmFunctionManager {
  constructor (memory, malloc, free) {
    this.memory = memory
    this.malloc = malloc
    this.free = free
  }

  createTypedArray (typedArrayType, length) {
    const ptr = this.malloc(length * typedArrayType.BYTES_PER_ELEMENT)
    const typedArray = new typedArrayType(
      this.memory.buffer,
      ptr,
      length)
    
      if (typedArray.byteOffset === 0) {
      throw new RangeError('Unable to allocate memory for typed array')
    }

    return typedArray
  }

  invokeUnaryFunction(func, array, typedArrayType) {
    let input = null
    let output = null

    try {
      input = this.createTypedArray(typedArrayType, array.length)
      input.set(array)

      output = new typedArrayType(
        this.memory.buffer,
        func(input.byteOffset, array.length),
        array.length
      )

      if (output.byteOffset === 0) {
        throw new RangeError('Failed to allocate memory')
      }

      const result = Array.from(output)

      return result
    } finally {
      this.free(input.byteOffset)
      this.free(output.byteOffset)
    }
  }

  invokeBinaryFunction(func, lhs, rhs, typedArrayType) {
    if (lhs.length !== rhs.length) {
      throw new RangeError('Arrays must the the same length')
    }
    const length = lhs.length

    let input1 = null
    let input2 = null
    let output = null

    try {
      input1 = this.createTypedArray(typedArrayType, length)
      input2 = this.createTypedArray(typedArrayType, length)

      input1.set(lhs)
      input2.set(rhs)

      output = new typedArrayType(
        this.memory.buffer,
        func(input1.byteOffset, input2.byteOffset, length),
        length
      )

      if (output.byteOffset === 0) {
        throw new RangeError('Failed to allocate memory')
      }

      const result = Array.from(output)

      return result
    } finally {
      this.free(input1.byteOffset)
      this.free(input2.byteOffset)
      this.free(output.byteOffset)
    }
  }
}
