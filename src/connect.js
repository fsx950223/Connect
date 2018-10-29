export default class Connect {
    constructor(domain, options) {
        this.domain = domain;
        Object.assign(this, options);
        ['post', 'put', 'patch'].map(method => {
            this[method] = async (url, requestParam, options) => {
                url = this.resolveUrl(this.origin, this.domain, url);
                const headers = new Headers({
                    ...this.headerParam,
                    ...options.headerParam
                });
                const requestBody = this.detectRequestParam(requestParam, headers);
                const request = new Request(url, {
                    method: 'post',
                    body: requestBody,
                    headers,
                    ...this.generateOptions(options)
                });
                return this.pretreatment(await fetch(request));
            };
        });
        ['get', 'head', 'options', 'delete'].map(method => {
            this[method] = async (url, requestParam, options) => {
                const headers = new Headers({
                    ...this.headerParam,
                    ...options.headerParam
                });
                url = this.setUrl(url, requestParam);
                const request = new Request(url, {
                    method: 'get',
                    headers,
                    ...this.generateOptions(options)
                });
                return this.pretreatment(await fetch(request));
            };
        });
    }
    /**
     * 初始化全局参数
     *
     * @static
     * @param {string} origin 全局地址源
     * @param {IHeaderParam} headerParam 全局头参数
     * @memberof Connect
     */
    static init(options) {
        Object.assign(Connect.prototype, options);
    }
    /**
     * 预处理函数,可以重写
     *
     * @private
     * @param {Response} response 响应体
     * @returns {Promise<any>} 预处理后的Promise
     * @memberof Connect
     */
    async pretreatment(response) {
        if (response.ok) {
            if (response.headers.get('Content-Type').includes('application/json')) {
                const json = await response.json();
                return json;
            }
            else if (response.headers.get('Content-Type').includes('text/html')) {
                const text = await response.text();
                return text;
            }
            return response;
        }
        else {
            const json = await response.json;
            throw new Error(JSON.stringify(json));
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
    setUrl(url, requestParam) {
        const urlObject = new URL(this.resolveUrl(this.origin, this.domain, url));
        for (const param in requestParam) {
            if (requestParam.hasOwnProperty(param)) {
                urlObject
                    .searchParams
                    .set(param, requestParam[param]);
            }
        }
        return urlObject.toString();
    }
    /**
     * 拼接URL
     *
     * @private
     * @param {any} params 要拼接的url字符串
     * @returns 拼接后的URL
     * @memberof Connect
     */
    resolveUrl(...params) {
        if (params[2].startsWith('http')) {
            return params[2];
        }
        return params.filter(param => !!param).join('/');
    }
    detectRequestParam(requestParam, headers) {
        const type = headers.get('Content-Type');
        const generateFormData = (request) => {
            const formData = new FormData();
            for (const param in request) {
                if (request.hasOwnProperty(param)) {
                    formData.set(param, request[param]);
                }
            }
            return formData;
        };
        switch (type) {
            case null:
                return generateFormData(requestParam);
            case 'application/json':
                return JSON.stringify(requestParam);
        }
    }
    generateOptions(options) {
        return {
            credentials: options.credentials || this.credentials,
            mode: options.mode || this.mode,
            cache: options.cache || this.cache,
            referrer: options.referrer || this.referrer,
            referrerPolicy: options.referrerPolicy || this.referrerPolicy,
            integrity: options.integrity || this.integrity
        };
    }
}
