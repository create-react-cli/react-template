import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css'

export default class App extends Component {
    render() {
        return (
            <div className="app">
                <img src={logo} alt="图片" className="logo"/>
                <a className="text" href="https://juejin.im/user/5d38178cf265da1bb27773f4/posts" target="_blank">
                    欢迎进入Number的掘金主页
                </a>      
            </div>
        )
    }
}