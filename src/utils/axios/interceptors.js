// import axios from 'axios';
// import { toLogin } from '../../common/index';
// import { handleError } from './handleError';

// // 创建axios请求实例
// axios.create({
//     baseURL: '/api',
//     timeout: 1000,
//     headers: {'X-Custom-Header': 'foobar'}
// })

// /**
//  * @
//  * @description 请求拦截器 判断有无token，如果有，给加上，如果没有，不让发请求
//  * */ 
// axios.interceptors.request.use(    
//     config => {
//         // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
//         // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
//         const token = window.sessionStorage('token') || '';       
//         if (token) {
//              config.token = token;
//         } else {
//             toLogin()
//         }
       
//         return config;    
//     },    
//     error => {        
//         return Promise.error(error);    
//     }
// )

// /**
//  * @description 服务器响应拦截器
//  * */ 

// axios.interceptors.response.use(    
//     response => {        
//         if (response.status === 200) {            
//             return Promise.resolve(response);        
//         } else {            
//             return Promise.reject(response);        
//         }    
//     },
//     // 服务器状态码不是200的情况    
//     error => {        
//         if (error.response.status) {            
//             switch (error.response.status) {                              
//                 case 401:                    
//                     toLogin()
//                     break;
//                 case 403:                                                    
//                     toLogin()            
//                     break;
//                 case 404:    
//                     handleError('error', '404', error.response.message)
//                     break;
//                 case 501:
//                     handleError('error', '501', error.response.message)
//                     break;
//                 case 502:
//                     handleError('error', '502', error.response.message)
//                     break;
//                 case 503:
//                     handleError('error', '503', error.response.message)
//                     break;
//                 default:                    
//                     break;
//             }            
//             return Promise.reject(error.response);        
//         }       
//     }
// );