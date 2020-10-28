import React, { useEffect, useState } from 'react';
import firebase from './firebase';
import { Link } from 'react-router-dom';
import {useHistory} from 'react-router';

import { 
    Typography, 
    Paper, 
    Avatar, 
    Button, 
    FormControl, 
    Input, 
    InputLabel, 
    makeStyles,
} from '@material-ui/core';

import {
    LockOutlined as LockOutlinedIcon,
} from '@material-ui/icons';


const useStyle = makeStyles((theme) => ({
	paper: {
		marginTop: '100px',
        marginLeft: '30%',
        marginRight: '30%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
	},
	avatar: {
		margin: theme.spacing.unit,
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing.unit,
	},
	submit: {
		marginTop: theme.spacing.unit * 3,
	},
}));

const Register = () => {
    const classes = useStyle();
    const history = useHistory();

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

    useEffect(() => {
        if(firebase.getCurrentUsername()) history.push('/');
    })
    
    async function onRegister() {
        if(!email || !password || !name) return;
		try {
			await firebase.register(name, email, password);
			history.push('/');
		} catch(error) {
			console.log(error.message);
		}
	}

	return (
        <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Register Account
            </Typography>
            <form className={classes.form} onSubmit={e => e.preventDefault() && false }>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel>Name</InputLabel>
                    <Input autoFocus value={name} onChange={e => setName(e.target.value)} />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel>Email Address</InputLabel>
                    <Input value={email} onChange={e => setEmail(e.target.value)}  />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel>Password</InputLabel>
                    <Input type="password" value={password} onChange={e => setPassword(e.target.value)}  />
                </FormControl>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={onRegister}
                    className={classes.submit}
                >
                    Register
                </Button>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    component={Link}
                    to="/login"
                    className={classes.submit}
                >
                    Go back to Login
                </Button>
            </form>
        </Paper>
	)
}

export default Register;