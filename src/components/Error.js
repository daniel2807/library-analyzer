import React from 'react';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import {
    Typography,
    makeStyles,
} from '@material-ui/core';

const useStyle = makeStyles((theme) => ({
    root: {
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '500%',
        textAlign: 'center',
        marginTop: '400px',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '60px',   /* Height of the footer */
    }
}));

const Error = () => {
    const classes = useStyle();

    return(
        <>
            <div className={classes.root}>
                <Typography variant="h2">
                    <span>404 - Not found </span>
                    <span role="img" aria-label="curious-emoji">
                        😢
                    </span>
                    <br />
                    <span>
                        <Link style={{color: 'black'}} to='/test-app/'>Back Home</Link>
                    </span>
                </Typography>
            </div>

            <div className={classes.footer}>
                <Footer />
            </div>
        </>
    )
};

export default (Error);