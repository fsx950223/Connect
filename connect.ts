/**
 * 请求参数接口
 *
 * @interface IRequestParam
 */
interface IRequestParam {
    readonly[propName : string] : any;
}
/**
 * 头参数接口
 *
 * @interface IHeaderParam
 */
interface IHeaderParam {
    readonly[propName : string] : string;
}

export const enum CredentialsEnums {
    omit,
    sameOrigin,
    include
}
export const enum CacheEnums {
    default,
    noStore,
    reload,
    noCache,
    forceCache,
    onlyIfCached
}

export const enum RedirectEnums {
    follow,
    error,
    manual
}

export const enum ModeEnums {
    cors,
    noCors,
    sameOrigin
}

export const enum ReferrerEnums {
    noReferrer,
    client
}

export const enum ReferrerPolicyEnums {
    noReferrer,
    noReferrerWhenDowngrade,
    origin,
    originWhenCrossOrigin,
    unsafeUrl
}
/**
 * 选项接口
 *
 * @interface IOptions
 */
interface IOptions {
    origin?: string;
    headerParam?: IHeaderParam;
    messageKey?: string;
    credentials?: RequestCredentials;
    cache?: RequestCache;
    redirect?: RequestRedirect;
    referrer?: string;
    referrerPolicy?: ReferrerPolicy;
    mode?: RequestMode;
    integrity?: string;
}

export interface IConnect {
    post(url : string, requestParam : any, headerParam?: IHeaderParam) : Promise < any >;
    get(url : string, requestParam?: IRequestParam, headerParam?: IHeaderParam) : Promise < any >;
    put(url : string, requestParam?: any, headerParam?: IHeaderParam) : Promise < any >;
    delete(url : string, requestParam?: IRequestParam, headerParam?: IHeaderParam) : Promise < any >;
    patch(url : string, requestParam?: any, headerParam?: IHeaderParam) : Promise < any >;
    head(url : string, requestParam?: IRequestParam, headerParam?: IHeaderParam) : Promise < any >;
    options(url : string, requestParam?: IRequestParam, headerParam?: IHeaderParam) : Promise < any >;
}

export class Connect implements IConnect {
    private headerParam : IHeaderParam;
    private origin : string;
    private messageKey : string;
    private credentials : RequestCredentials;
    private cache : RequestCache;
    private redirect : RequestRedirect;
    private referrer : string;
    private referrerPolicy : ReferrerPolicy;
    private mode : RequestMode;
    private integrity : string;
    constructor(private domain : string, options?: IOptions) {
        this.setKeys(this, options);
    }
    /**
     * 初始化全局参数
     *
     * @static
     * @param {string} origin 全局地址源
     * @param {IHeaderParam} headerParam 全局头参数
     * @memberof Connect
     */
    static init(options : IOptions) {
        Connect
            .prototype
            .setKeys(Connect.prototype, options);
    }

    async post(url : string, requestParam : IRequestParam, options?: IOptions) : Promise < any > {
        url = this.resolveUrl(this.origin, this.domain, url);
        const headers = new Headers({
            ...this.headerParam,
            ...options.headerParam
        });
        const requestBody = this.detectRequestParam(requestParam, headers.get('Content-Type'));
        const request = new Request(url, {
            method: 'post',
            body: requestBody,
            headers,
            ...this.generateOptions(options)
        });
        return this.pretreatment(await fetch(request));
    }
    async get(url : string, requestParam?: IRequestParam, options?: IOptions) : Promise < any > {
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
    }
    async put(url : string, requestParam : IRequestParam, options?: IOptions) : Promise < any > {
        url = this.resolveUrl(this.origin, this.domain, url);
        const headers = new Headers({
            ...this.headerParam,
            ...options.headerParam
        });
        const requestBody = this.detectRequestParam(requestParam, headers.get('Content-Type'));
        const request = new Request(url, {
            method: 'put',
            body: requestBody,
            headers,
            ...this.generateOptions(options)
        });
        return this.pretreatment(await fetch(request));
    }

    async delete(url : string, requestParam?: IRequestParam, options?: IOptions) : Promise < any > {
        const headers = new Headers({
            ...this.headerParam,
            ...options.headerParam
        });
        url = this.setUrl(url, requestParam);
        const request = new Request(url, {
            method: 'delete',
            headers,
            ...this.generateOptions(options)
        });
        return this.pretreatment(await fetch(request));
    }
    /**
     * patch请求
     *
     * @param {string} url 请求地址
     * @param {*} requestParam 请求参数
     * @param {IHeaderParam} [headerParam] 请求头
     * @returns {Promise<any>} 返回预处理后的Promise
     * @memberof Connect
     */
    async patch(url : string, requestParam : IRequestParam, options?: IOptions) : Promise < any > {
        url = this.resolveUrl(this.origin, this.domain, url);
        const headers = new Headers({
            ...this.headerParam,
            ...options.headerParam
        });
        const requestBody = this.detectRequestParam(requestParam, headers.get('Content-Type'));
        const request = new Request(url, {
            method: 'patch',
            body: requestBody,
            headers,
            ...this.generateOptions(options)
        });
        return this.pretreatment(await fetch(request));
    }
    /**
     * head请求
     *
     * @param {string} url 请求地址
     * @param {IRequestParam} [requestParam] 请求参数
     * @param {IHeaderParam} [headerParam] 请求头
     * @returns {Promise<any>} 返回预处理后的Promise
     * @memberof Connect
     */
    async head(url : string, requestParam?: IRequestParam, options?: IOptions) : Promise < any > {
        const headers = new Headers({
            ...this.headerParam,
            ...options.headerParam
        });
        url = this.setUrl(url, requestParam);
        const request = new Request(url, {
            method: 'head',
            headers,
            ...this.generateOptions(options)
        });
        return this.pretreatment(await fetch(request));
    }

    /**
     * option请求
     *
     * @param {string} url 请求地址
     * @param {IRequestParam} [requestParam] 请求参数
     * @param {IOptions} options 请求头
     * @returns {Promise<any>} 返回预处理后的Promise
     * @memberof Connect
     */
    async options(url : string, requestParam?: IRequestParam, options?: IOptions) : Promise < any > {
        const headers = new Headers({
            ...this.headerParam,
            ...options.headerParam
        });
        url = this.setUrl(url, requestParam);
        const request = new Request(url, {
            method: 'options',
            headers,
            ...this.generateOptions(options)
        });
        return this.pretreatment(await fetch(request));
    }
    /**
     * 预处理函数
     *
     * @private
     * @param {Response} response 响应体
     * @returns {Promise<any>} 预处理后的Promise
     * @memberof Connect
     */
    private async pretreatment(response : Response) : Promise < any > {
        try {
            const result = await response.json();
            if (response.ok) {
                return result;
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            throw new Error('连接故障');
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
    private setUrl(url : string, requestParam?: IRequestParam) {
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
    private resolveUrl(...params) {
        return params.join('/');
    }

    private detectRequestParam(requestParam : IRequestParam, contentType : string) {
        const generateFormData = (request : IRequestParam) => {
            const formData = new FormData();
            for (const param in request) {
                if (request.hasOwnProperty(param)) {
                    formData.set(param, request[param]);
                }
            }
            return formData;
        };
        switch (contentType) {
            case 'application/json':
                return JSON.stringify(requestParam);
            case 'multipart/form-data':
                return generateFormData(requestParam);
        }
    }

    private generateOptions(options) {
        return {
            credentials: options.credentials || this.credentials,
            mode: options.mode || this.mode,
            cache: options.cache || this.cache,
            referrer: options.referrer || this.referrer,
            referrerPolicy: options.referrerPolicy || this.referrerPolicy,
            integrity: options.integrity || this.integrity
        };
    }

    private setKeys(source, options) {
        if (options) {
            const keys = Reflect
                .ownKeys(source)
                .filter(key => typeof key !== 'function' && key !== 'constructor');
            for (const key in keys) {
                if (key in options) 
                    source[key] = options[key];
                }
            }
    }
}
