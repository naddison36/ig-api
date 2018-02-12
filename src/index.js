import { create, setHeaderTokens } from './axios'
import {
  uniqueId,
  getOption,
  isFunction,
  transformError,
  transformResponse
} from './utils'

export default class IG {

  static transformResponse = transformResponse
  static transformError = transformError
  static uniqueId = uniqueId

  constructor(apiKey, isDemo, options) {
    this.api = create(apiKey, isDemo)
    this.defaults = Object.assign({
      transformResponse,
      transformError
    }, options)
  }

  request(method, path, version, config, options) {
    const transformRes = getOption('transformResponse', options, this.defaults)
    const transformErr = getOption('transformError', options, this.defaults)

    let request = this.api.request(Object.assign({}, config, {
      method, url: path, headers: { Version: version || 1 }
    }))

    if (isFunction(transformRes)) request = request.then(transformRes)
    if (isFunction(transformErr)) request = request.catch(transformErr)

    return request
  }

  get(path, version, params, options) {
    return this.request('get', path, version, { params }, options)
  }

  post(path, version, data, options) {
    return this.request('post', path, version, { data }, options)
  }

  put(path, version, data, options) {
    return this.request('put', path, version, { data }, options)
  }

  delete(path, version, data, options) {
    return this.request('delete', path, version, { data }, options)
  }

  login(username, password, options) {
    return this.post('session', 2, {
      encryptedPassword: false,
      identifier: username,
      password: password
    }, {
      transformResponse: false
    }).then((response) => {
      setHeaderTokens(this.api, response)
      const transformRes = getOption('transformResponse', options, this.defaults)
      return isFunction(transformRes) ? transformRes(response) : response
    })
  }

  logout(options) {
    return this.delete('session', 1, null, options)
  }
}
