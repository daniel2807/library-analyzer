import React, {useState, useEffect} from 'react';
import firebase from './firebase';
import { Link } from 'react-router-dom';
import {useHistory} from 'react-router';

import {
    Paper,
    Avatar,
    Typography,
    FormControl,
    InputLabel,
    Input,
    Button,
    makeStyles,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

import {LockOutlined as LockOutlinedIcon} from '@material-ui/icons';

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

const Alert = (props) => {
    return <MuiAlert elevation={6} variant='filled' {...props} />
}

const Login = () => {
    const classes = useStyle();
    const history  = useHistory();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loginError, setLoginError] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        if(!firebase.getCurrentUsername()) {
            setSnackbarOpen(true);
            return;
        }
        history.push('/');
    }, [history]);

    async function login() {
        if(!email || !password) return;
        try {
            await firebase.login(email, password);
            history.push('/');
        } catch(error) {
            setErrorMessage(error.message);
            setLoginError(true);
        }
    }

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    }
    
    return(
        <>
            <Dialog open={loginError} onClose={() => setLoginError(false)}>
                <DialogTitle >Something went wrong on login</DialogTitle>
                <DialogContent style={{color: 'red'}}>{errorMessage}</DialogContent>
                <DialogActions>
                    <Button onClick={() => setLoginError(false)}>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>

            <Paper className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} onSubmit={e => e.preventDefault() && false}>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="email">Email Address</InputLabel>
                        <Input id="email" name="email" autoComplete="off" autoFocus value={email} onChange={e => setEmail(e.target.value)} />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <Input name="password" type="password" id="password" autoComplete="off" value={password} onChange={e => setPassword(e.target.value)} />
                    </FormControl>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={login}
                        className={classes.submit}>
                        Sign in
                    </Button>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="secondary"
                        component={Link}
                        to="/register"
                        className={classes.submit}>
                        Register
                    </Button>
                </form>
            </Paper>

            <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity='error'>
                    Your are not locked in
                </Alert>
            </Snackbar>
        </>
    )
}

export default Login;