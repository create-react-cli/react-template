import  promiseAjax from "../utils/axios";
import {handleError} from './handleError';

export const proAjax = new promiseAjax({
    onShowError: handleError({error, errorTip})
});

// 默认配置
proAjax.defaults.baseURL = '/api';
proAjax.defaults.timeout = 1000 * 60;
// promiseAjax.defaults.headers.common["auth-token"] = Cookies.get("auth-token");


proAjax.instance(instance => {
    instance.interceptors.request.use(cfg => {
        return cfg;
    }, error => {
        return Promise.reject(error)
    })
})