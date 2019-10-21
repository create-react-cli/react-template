const baseURL = 'http://localhost:8000'

if (process.env.NODE_ENV === 'development') {
    export default baseURL;
} else if (process.env.NODE_ENV === 'production') {
    export default 'http://172.16.42.215:8000'
}