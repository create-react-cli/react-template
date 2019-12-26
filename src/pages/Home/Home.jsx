import React, { Component } from 'react';
import axios from 'axios';
import jsonp from 'jsonp';
import $ from 'jquery';

export default class Home extends Component {
    getData = () => {
        axios.get('/sug?q=11')
            .then(res => {
                console.log(res);
            })
    }
    render() {
        return (
            <input placeholder="请输入" onChange={this.getData} />
        )
    }
}