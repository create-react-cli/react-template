import React, { Component } from 'react';
import promiseAjax from "../../utils/axios";

export default class Home extends Component {
    getData = () => {
        promiseAjax
    }
    render() {
        return (
            <input placeholder="请输入" onChange={this.getData} />
        )
    }
}