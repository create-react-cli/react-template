import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css'

export default class App extends Component {
    render() {
        return (
            <div className="app">
                <img src={logo} alt="图片" className="rotation logo"/>
                <a className="text" href="https://juejin.im/user/5d38178cf265da1bb27773f4/posts" target="_blank">
                    点击进入我的掘金主页
                </a>  
                <a className="text" href="https://github.com/Alberqing" target="_blank">
                    点击进入我的github主页
                </a>  
                <a className="text" href="https://blog.csdn.net/Alberqing_" target="_blank">
                    点击进入我的CSDN主页
                </a>      
            </div>
        )
    }
}