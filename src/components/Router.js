import React, { useState, useEffect } from 'react';
import {HashRouter, Switch, Route} from 'react-router-dom';

import { CircularProgress} from '@material-ui/core';

import Home from './Home';
import Compare from './Compare';
import Error from './Error';
import Login from './Login';
import Register from './Register';
import Bar from './Bar';
import firebase from './firebase';
import './styles/Router.css';

const SideRouter = () => {
    const [firebaseInitialized, setFirebaseInitialized] = useState(false);

    useEffect(() => {
        firebase.isInitialized().then(value => {
            setFirebaseInitialized(value);
        });
    }, []);

    return firebaseInitialized !== false ? (
        <HashRouter basename='/'>
            <>
                <Bar />
                
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route exact path='/compare' component={Compare} />
                    <Route path='/login' render={() => <Login />} />
                    <Route exact path='/register' component={Register} />
                    <Route component={Error} />
                </Switch>
            </>
        </HashRouter>
    ) : (
        <div id="loader">
            <CircularProgress />
        </div>
    )
};

export default SideRouter;