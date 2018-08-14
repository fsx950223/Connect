/**
 * 头参数接口
 *
 * @interface IHeaderParam
 */
interface IHeaderParam {
    readonly [propName: string]: string;
}
export declare const enum CredentialsEnums {
    omit = 0,
    sameOrigin = 1,
    include = 2
}
export declare const enum CacheEnums {
    default = 0,
    noStore = 1,
    reload = 2,
    noCache = 3,
    forceCache = 4,
    onlyIfCached = 5
}
export declare const enum RedirectEnums {
    follow = 0,
    error = 1,
    manual = 2
}
export declare const enum ModeEnums {
    cors = 0,
    noCors = 1,
    sameOrigin = 2
}
export declare const enum ReferrerEnums {
    noReferrer = 0,
    client = 1
}
export declare const enum ReferrerPolicyEnums {
    noReferrer = 0,
    noReferrerWhenDowngrade = 1,
    origin = 2,
    originWhenCrossOrigin = 3,
    unsafeUrl = 4
}
/**
 * 选项接口
 *
 * @interface IOptions
 */
interface IOptions {
    origin?: string;
    headerParam?: IHeaderParam;
    credentials?: RequestCredentials;
    cache?: RequestCache;
    referrer?: string;
    referrerPolicy?: ReferrerPolicy;
    mode?: RequestMode;
    integrity?: string;
}
export declare class Connect {
    private domain;
    private headerParam;
    private origin;
    private credentials;
    private cache;
    private referrer;
    private referrerPolicy;
    private mode;
    private integrity;
    constructor(domain: string, options?: IOptions);
    /**
     * 初始化全局参数
     *
     * @static
     * @param {string} origin 全局地址源
     * @param {IHeaderParam} headerParam 全局头参数
     * @memberof Connect
     */
    static init(options: IOptions): void;
    /**
     * 预处理函数,可以重写
     *
     * @private
     * @param {Response} response 响应体
     * @returns {Promise<any>} 预处理后的Promise
     * @memberof Connect
     */
    pretreatment(response: Response): Promise<any>;
    /**
     * 将url与requestParam拼接成URL
     *
     * @param {any} url 请求地址
     * @param {any} requestParam 请求参数
     * @returns 拼接完成的url
     * @memberof Connect
     */
    private setUrl;
    /**
     * 拼接URL
     *
     * @private
     * @param {any} params 要拼接的url字符串
     * @returns 拼接后的URL
     * @memberof Connect
     */
    private resolveUrl;
    private detectRequestParam;
    private generateOptions;
}
export {};
