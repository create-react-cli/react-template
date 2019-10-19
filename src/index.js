import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';


if(module.hot){ // 如果支持热更新
    module.hot.accept(); // 当入口文件变化后重新执行当前入口文件
}

ReactDOM.render( 
    <App /> ,
    document.getElementById('root')
);