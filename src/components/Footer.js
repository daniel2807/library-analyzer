import React from 'react';
import {
    Typography, 
    makeStyles,
} from '@material-ui/core';

const useStyle = makeStyles((theme) => ({
    footer: {
        // position: 'fixed',
        bottom: theme.spacing(2),
        width: '100%',
    },
    emoji: {
        margin: '5px',
    },
}));

const Footer = () => {
    const classes = useStyle();
    return (
        <Typography className={classes.footer} align="center">
            Made with
            <span className={classes.emoji} role="img" aria-label="heart-emoji">
                💖 
            </span>
            and
            <span className={classes.emoji} role="img" aria-label="coffee-emoji">
                ☕ 
            </span>
            by DTD.
        </Typography>
    )
}

export default Footer;