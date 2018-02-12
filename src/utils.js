import {
  path,
  pipe,
  type,
  equals
} from 'rambda'
import createError from './error'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export const isFunction = pipe(type, equals('Function'))
export const isUndefined = pipe(type, equals('Undefined'))

export function get(inputObject, inputPath, defaultValue) {
  const inputValue = path(inputPath, inputObject)
  return isUndefined(inputValue) ? defaultValue : inputValue
}

export function getOption(key, options, defaults) {
  return get(options, key, path(key, defaults))
}

export function transformResponse(response) {
  return path('data', response)
}

export function transformError(error) {
  throw createError(error)
}

export function uniqueId(length = 15, chars = CHARS) {
  let i, result = ''
  for (i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}
