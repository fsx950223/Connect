export default class Connect {
  constructor (domain, options) {
    this.domain = domain
    this.origin = ''
    this.messageKey = ''
    this.referrer = ''
    this.integrity = ''
    this.headerParam = {}
    this.setKeys(this, options)
  }
  /**
     * 初始化全局参数
     *
     * @static
     * @param {} origin 全局地址源
     * @param {IHeaderParam} headerParam 全局头参数
     * @memberof Connect
     */
  static init (options) {
    Connect
      .prototype
      .setKeys(Connect.prototype, options)
  }

  async post (url, requestParam, options = {}) {
    url = this.resolveUrl(this.origin, this.domain, url)
    const headers = new Headers({
      ...this.headerParam,
      ...options.headerParam
    })
    const requestBody = this.detectRequestParam(requestParam, headers)
    const request = new Request(url, {
      method: 'post',
      body: requestBody,
      headers,
      ...this.generateOptions(options)
    })
    return this.pretreatment(await fetch(request))
  }
  async get (url, requestParam, options = {}) {
    const headers = new Headers({
      ...this.headerParam,
      ...options.headerParam
    })
    url = this.setUrl(url, requestParam)
    const request = new Request(url, {
      method: 'get',
      headers,
      ...this.generateOptions(options)
    })
    return this.pretreatment(await fetch(request))
  }
  async put (url, requestParam, options = {}) {
    url = this.resolveUrl(this.origin, this.domain, url)
    const headers = new Headers({
      ...this.headerParam,
      ...options.headerParam
    })
    const requestBody = this.detectRequestParam(requestParam, headers.get('Content-Type'))
    const request = new Request(url, {
      method: 'put',
      body: requestBody,
      headers,
      ...this.generateOptions(options)
    })
    return this.pretreatment(await fetch(request))
  }

  async delete (url, requestParam, options = {}) {
    const headers = new Headers({
      ...this.headerParam,
      ...options.headerParam
    })
    url = this.setUrl(url, requestParam)
    const request = new Request(url, {
      method: 'delete',
      headers,
      ...this.generateOptions(options)
    })
    return this.pretreatment(await fetch(request))
  }
  /**
     * patch请求
     *
     * @param {} url 请求地址
     * @param {*} requestParam 请求参数
     * @param {IHeaderParam} [headerParam] 请求头
     * @returns {Promise<any>} 返回预处理后的Promise
     * @memberof Connect
     */
  async patch (url, requestParam, options) {
    url = this.resolveUrl(this.origin, this.domain, url)
    const headers = new Headers({
      ...this.headerParam,
      ...options.headerParam
    })
    const requestBody = this.detectRequestParam(requestParam, headers.get('Content-Type'))
    const request = new Request(url, {
      method: 'patch',
      body: requestBody,
      headers,
      ...this.generateOptions(options)
    })
    return this.pretreatment(await fetch(request))
  }
  /**
     * head请求
     *
     * @param {} url 请求地址
     * @param {} [requestParam] 请求参数
     * @param {IHeaderParam} [headerParam] 请求头
     * @returns {Promise<any>} 返回预处理后的Promise
     * @memberof Connect
     */
  async head (url, requestParam, options) {
    const headers = new Headers({
      ...this.headerParam,
      ...options.headerParam
    })
    url = this.setUrl(url, requestParam)
    const request = new Request(url, {
      method: 'head',
      headers,
      ...this.generateOptions(options)
    })
    return this.pretreatment(await fetch(request))
  }

  /**
     * option请求
     *
     * @param {} url 请求地址
     * @param {} [requestParam] 请求参数
     * @param {IOptions} options 请求头
     * @returns {Promise<any>} 返回预处理后的Promise
     * @memberof Connect
     */
  async options (url, requestParam, options) {
    const headers = new Headers({
      ...this.headerParam,
      ...options.headerParam
    })
    url = this.setUrl(url, requestParam)
    const request = new Request(url, {
      method: 'options',
      headers,
      ...this.generateOptions(options)
    })
    return this.pretreatment(await fetch(request))
  }
  /**
     * 预处理函数
     *
     * @param {Response} response 响应体
     * @returns {Promise<any>} 预处理后的Promise
     * @memberof Connect
     */
  async pretreatment (response) {
    if (response.ok) {
      if (response.headers.get('Content-Type').includes('application/json')) {
        const json = await response.json()
        return json
      } else if (response.headers.get('Content-Type').includes('text/html')) {
        const text = await response.text()
        return text
      }
      return response
    } else {
      const json = await response.json
      throw new Error(json.message)
    }
  }
  /**
     * 将url与requestParam拼接成URL
     *
     * @param {any} url 请求地址
     * @param {any} requestParam 请求参数
     * @returns 拼接完成的url
     * @memberof Connect
     */
  setUrl (url, requestParam) {
    const urlObject = new URL(this.resolveUrl(this.origin || location.origin, this.domain, url))
    for (const param in requestParam) {
      if (requestParam.hasOwnProperty(param)) {
        urlObject
          .searchParams
          .set(param, requestParam[param])
      }
    }
    return urlObject.toString()
  }
  /**
     * 拼接URL
     *
     * @
     * @param {any} params 要拼接的url字符串
     * @returns 拼接后的URL
     * @memberof Connect
     */
  resolveUrl (...params) {
    if (params[2].startsWith('http')) {
      return params[2]
    }
    return params.filter(param => !!param).join('/')
  }

  detectRequestParam (requestParam, headers) {
    const key = Reflect.ownKeys(requestParam)[0]
    const type = Object.prototype.toString.call(requestParam[key]).split(' ')[1].slice(0, -1)
    const generateFormData = (request) => {
      const formData = new FormData()
      for (const param in request) {
        if (request.hasOwnProperty(param)) {
          formData.set(param, request[param])
        }
      }
      return formData
    }
    switch (type) {
      case 'File':
        headers.delete('Content-Type')
        return generateFormData(requestParam)
      default:
        return JSON.stringify(requestParam)
    }
  }

  generateOptions (options) {
    return {
      credentials: options.credentials || this.credentials,
      mode: options.mode || this.mode,
      cache: options.cache || this.cache,
      referrer: options.referrer || this.referrer,
      referrerPolicy: options.referrerPolicy || this.referrerPolicy,
      integrity: options.integrity || this.integrity
    }
  }

  setKeys (source, options) {
    if (options) {
      const keys = Reflect
        .ownKeys(source)
        .filter(key => (typeof source[key] !== 'function') && (key !== 'constructor'))
      for (const key of keys) {
        if (key in options) { source[key] = options[key] }
      }
    }
  }
}
