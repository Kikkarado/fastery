import React, { useContext, useState } from 'react'
import { AuthContext } from "../context/Auth"
import { useNavigate, Navigate } from "react-router-dom"
import axios from 'axios'

import { withStyles } from '@mui/styles';
import { Container, Box, Grid, TextField, Typography, Button, Link } from '@mui/material';

import app from "../firebase";

import messages from '../util/messages';

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState({})
	const navigate = useNavigate()

	const emailRegex = RegExp(
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	);

	function checkData() {
		setErrors();

		let error = {}
		if (!emailRegex.test(email)) {
			error.email = 'Неверный формат электронной почты';
		}
		if (!password || password === '') {
			error.password = 'Пароль не может быть пустым';
		}

		setErrors(error);
		return error;
	}


	async function handleSubmit(e) {
		e.preventDefault()

		try {
			const error = checkData()
			if (!error.email && !error.password) {
				await app
					.auth()
					.signInWithEmailAndPassword(email, password).then((user) => {
						const uid = { uid: user.user.uid }
						axios.post('/login', uid).then(res => {
							console.log(res)
						})
					});
			}
		} catch (error) {
			let err = {}
			err.message = messages[error.code]
			setErrors(err)
		}
	}

	const currentUser = useContext(AuthContext);

	if (currentUser.currentUser) {
		return <Navigate to="/" />;
	}

	return (
		<Container sx={{ width: '100%', height: '70vh', minHeight: 500, maxHeight: 1200, display: 'flex', mt: 2 }}>
			<Grid sx={{ width: '100%', height: '100%' }}
				container rowSpacing={1} direction="column" justifyContent="flex-start" alignItems="center" >
				<Grid item xm={6} sx={{ textAlign: 'center', width: '40%' }}>
					<Typography variant='h3' sx={{ mb: '20px' }}
					>Войти</Typography>
					<form noValidate onSubmit={handleSubmit}>
						<TextField required sx={{ width: '100%', mb: '20px', borderRadius: 0.3 }}
							id="email" name="email" type="email" label="Электронная почта"
							helperText={errors.email}
							error={errors.email ? true : false}
							value={email} onChange={e => setEmail(e.target.value)} fullWidth
							inputProps={{
								maxLength: 40
							}} />
						<TextField required sx={{ width: '100%', mb: '20px' }}
							id="password" name="password" type="password" label="Пароль"
							helperText={errors.password}
							error={errors.password ? true : false}
							value={password} onChange={e => setPassword(e.target.value)} fullWidth
							inputProps={{
								maxLength: 30
							}} />
						{errors.message && <Typography variant='body1' color='error' sx={{ mb: '20px' }}>{errors.message}</Typography>}
						<Button sx={{ width: '30%', height: '40px', fontSize: '16pt', mb: '20px' }} type='submit' variant='contained' color='primary' >Войти</Button>
						<Typography variant='body1' style={{ wordWrap: "break-word", }} sx={{ mb: '20px', width: '100%' }}>
							Ещё не зарегестрированы?
							<Link sx={{ ml: '10px' }} variant='body1' underline="hover" component="button" onClick={() => { navigate('/signup') }}>Зарегестрироваться</Link></Typography>
					</form>
				</Grid>
			</Grid>
		</Container>
	)
}

export default Login;