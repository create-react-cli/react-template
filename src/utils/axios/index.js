import axios from 'axios';
import baseURL from '../../common/baseURL';
if (process.env.NODE_ENV === 'development') {

}
// 创建axios请求实例
axios.create({
    baseURL: `${baseURL}/api/`,
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
})

/**
 * @
 * @description 请求拦截器 判断有无token，如果有，给加上，如果没有，不让发请求
 * */ 
axios.interceptors.request.use(    
    config => {
        // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
        // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
        const token = store.state.token;        
        token && (config.headers.Authorization = token);        
        return config;    
    },    
    error => {        
        return Promise.error(error);    
    }
)

/**
 * @description 服务器响应拦截器
 * */ 

axios.interceptors.response.use(    
    response => {        
        if (response.status === 200) {            
            return Promise.resolve(response);        
        } else {            
            return Promise.reject(response);        
        }    
    },
    // 服务器状态码不是200的情况    
    error => {        
        if (error.response.status) {            
            switch (error.response.status) {                
                // 401: 未登录                
                // 未登录则跳转登录页面，并携带当前页面的路径                
                // 在登录成功后返回当前页面，这一步需要在登录页操作。                
                case 401:                    
                    
                    break;
                // 403 token过期                
                // 登录过期对用户进行提示                
                // 清除本地token和清空vuex中token对象                
                // 跳转登录页面                
                case 403:                                  
                    // 清除token                    
                
                // 404请求不存在                
                case 404:                    
                     
                // 其他错误，直接抛出错误提示                
                default:                    
                      
            }            
            return Promise.reject(error.response);        
        }       
    }
);