import React from 'react';
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
    },
}));

const Error = () => {
    const classes = useStyle();

    return(
        <div className={classes.root}>
            <Typography variant="h2">
                <span>404 - Not found </span>
                <span role="img" aria-label="curious-emoji">
                    😢
                </span>
                <br />
                <span>
                    <Link to='/'>Back Home</Link>
                </span>
            </Typography>
        </div>
    )
};

export default (Error);