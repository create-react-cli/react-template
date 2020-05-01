import axios from 'axios';


export default class promiseAjax {
    constructor() {
        this.instance = axios.create();
        this.setDefaultOption(this.instance);
        this.defaults = this.instance.defaults;
        console.log(this.instance);
    }

    setDefaultOption(instance) {
        instance.defaults.timeout = 10000;
        instance.defaults.headers.post['Content-Type'] = 'application/json';
        instance.defaults.headers.put['Content-Type'] = 'application/json';
        instance.defaults.baseURL = '/';
        instance.defaults.withCredentials = true; // 跨域携带cookie
    }

    ajax(url, data = {}, method = "get", options = {}) {
        let instance = this.instance;

        let {
            originResponse,
        } = options;

        const defaultsContentType = instance.defaults.headers[method]['Content-Type']
            || instance.defaults.headers[method]['content-type']
            || instance.defaults.headers[method]['contentType']
            || '';

        const contentType = (options.headers && options.headers['Content-Type'])
            || (options.headers && options.headers['content-type'])
            || (options.headers && options.headers['contentType'])
            || '';

        const CancelToken = axios.CancelToken;

        let cancel;

        const ajaxPromise = new Promise((resolve, reject) => {
            instance({
                method,
                url,
                data,
                cancelToken: new CancelToken(c => cancel = c),
                ...options,
            }).then(response => {
                resolve(originResponse ? response : response.data);
            }, err => {
                const isCanceled = err && err.message && err.message.canceled;
                if (isCanceled) return; // 如果是用户主动cancel，不做任何处理，不会触发任何函数
                reject(err);
            }).catch(error => {
                reject(error);
            });
        });
        ajaxPromise.cancel = function () {
            cancel({
                canceled: true,
            });
        };
        return ajaxPromise;
    }

    get(url, data, options) {
        return this.ajax(url, data, 'get', options);
    }

    patch(url, data, options) {
        return this.ajax(url, data, 'patch', options);
    }

    post(url, data, options) {
        return this.ajax(url, data, 'post', options);
    }

    put(url, data, options) {
        return this.ajax(url, data, 'put', options);
    }

    del(url, data, options) {
        return this.ajax(url, data, 'delete', options);
    }
}