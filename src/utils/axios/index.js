import axios from 'axios';

export const promiseAjax = {
    post: (url, data) => {
        return new Promise((resolve, reject) => {
            axios.post(url, data)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
                .finally(() => {
                    callback()
                })
        })
    },
    get: (url, data) => {
        return new Promise((resolve, reject) => {
            axios.get(url, {
                data
            }).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            }).finally(() => {
                callback()
            })
        })
    },
    all: (arr) => {
        return new Promise((resolve, reject) => {
            axios.all([...arr])
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
                .finally(() => {
                    callback()
                })
        })
    }
}