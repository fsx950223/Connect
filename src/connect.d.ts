/**
 * 头参数接口
 *
 * @interface IHeaderParam
 */
interface IHeaderParam {
    readonly [propName: string]: string;
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
export default class Connect {
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
