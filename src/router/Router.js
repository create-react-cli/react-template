import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router';
import { createBrowserHistory } from 'history';
import Home from '../pages/Home/Home';
import routes from '../pages/routes';

const history = createBrowserHistory();

export default class extends Component {
    render() {
        return (
            <Router history={history}>
                <div style={{height: '100%'}}>
                    <Route path='/' exact component={Home} />
                    {
                        routes.map(item => {
                            return (
                                <Route key={item.path} path={item.path} component={item.component} />
                            )
                        })
                    }
                </div>
            </Router>
        )
    }
}