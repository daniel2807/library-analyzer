import React from 'react';
import {
    HashRouter,
    // BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom';

import { 
    AppBar,
    Toolbar,
    Button,
    // Tooltip,
} from '@material-ui/core';

import Home from './Home';
import Compare from './Compare';
import Error from './Error';
import logo from './Icons/logo-mw-2x.png';
import './styles/Router.css';

const SideRouter = () => (
    <HashRouter basename='/'>
        <AppBar>
            <Toolbar style={{backgroundColor: 'rgb(40, 40, 40)'}}>
                {/* <Tooltip title='home'> */}
                    <Button style={{width: 200}}>
                        <Link to='/'>
                            <img alt="MaibornWolff" height="50" src={logo} />
                        </Link>
                    </Button>
                {/* </Tooltip> */}

                
                {/* <Tooltip title='compare without choosen libraries'> */}
                    <Button style={{width: 200, marginLeft: '10%'}}>
                        <Link to='/compare'>Compare</Link>
                    </Button>
                {/* </Tooltip> */}
            </Toolbar>
        </AppBar>

        <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/compare' component={Compare} />
            <Route component={Error} />
        </Switch>
    </HashRouter>
);

export default SideRouter;