import React, { useEffect } from 'react';
import { Link} from 'react-router-dom';
import logo from './Icons/logo-mw-2x.png';
import firebase from './firebase';

import {
    AppBar,
    Toolbar,
    Button,
} from '@material-ui/core';

const Bar = (props) => {
    const {show} = props;

    useEffect(() => {
        console.log(show)
    });
    
    return (
        <AppBar>
            <Toolbar style={{backgroundColor: 'rgb(40, 40, 40)'}}>
                <Button style={{width: 200}}>
                    <Link to='/'>
                        <img alt="MaibornWolff" height="50" src={logo} />
                    </Link>
                </Button>

            
                <Button style={{width: 200, marginLeft: '10%'}}>
                    <Link to='/compare'>Compare</Link>
                </Button>

                {!firebase.getCurrentUsername() ? (
                    <Button style={{width: 200}}>
                        <Link to='/login'>Login</Link>
                    </Button>
                ):(
                    <Button
                        style={{width: 200}} 
                        onClick={() => {
                            firebase.logout();
                            
                        }}
                    >
                        <Link to='/login'>Logout</Link>
                    </Button>
                )}
                
                {firebase.getCurrentUsername()}
            </Toolbar>
        </AppBar>
    )
}

export default Bar;