#include <stdlib.h>
#include <math.h>

__attribute__((used)) double* addFloat64Arrays (double* array1, double* array2, unsigned int length)
{
  double* result = (double*) malloc(length * sizeof(double));
  if (result == 0)
    return 0;

  for (int i = 0; i < length; ++i) {
    result[i] = array1[i] + array2[i];
  }

  return result;
}

__attribute__((used)) double* subtractFloat64Arrays (double* array1, double* array2, unsigned int length)
{
  double* result = (double*) malloc(length * sizeof(double));
  if (result == 0)
    return 0;

  for (int i = 0; i < length; ++i) {
    result[i] = array1[i] - array2[i];
  }

  return result;
}

__attribute__((used)) double* multiplyFloat64Arrays (double* array1, double* array2, unsigned int length)
{
  double* result = (double*) malloc(length * sizeof(double));
  if (result == 0)
    return 0;

  for (int i = 0; i < length; ++i) {
    result[i] = array1[i] * array2[i];
  }

  return result;
}

__attribute__((used)) double* divideFloat64Arrays (double* array1, double* array2, unsigned int length)
{
  double* result = (double*) malloc(length * sizeof(double));
  if (result == 0)
    return 0;

  for (int i = 0; i < length; ++i) {
    result[i] = array1[i] + array2[i];
  }

  return result;
}

__attribute__((used)) double* negateFloat64Array (double* array, unsigned int length)
{
  double* result = (double*) malloc(length * sizeof(double));
  if (result == 0)
    return 0;

  for (int i = 0; i < length; ++i) {
    result[i] = -array[i];
  }

  return result;
}


__attribute__((used)) double* logFloat64Array (double* array, unsigned int length)
{
  double* result = (double*) malloc(length * sizeof(double));
  if (result == 0)
    return 0;

  for (int i = 0; i < length; ++i) {
    result[i] = log(array[i]);
  }

  return result;
}
