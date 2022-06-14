import React, { useContext, useState } from 'react'
import { AuthContext } from "../context/Auth"
import { useNavigate, Navigate } from "react-router-dom"
import axios from 'axios'

import { Container, Grid, TextField, Typography, Button, Link } from '@mui/material';

import app from "../firebase";
import InputMask from "react-input-mask";

import messages from '../util/messages';

function Signup() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confPassword, setConfPassword] = useState('');
	const [name, setName] = useState('');
	const [surname, setSurname] = useState('');
	const [patronymic, setPatronymic] = useState('');
	const [phone, setPhone] = useState('');

	const [errors, setErrors] = useState({})
	const navigate = useNavigate()

	const emailRegex = RegExp(
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	);

	const phoneRegex = RegExp(
		/((\+38)?\(?\d{3}\)?[\s\.-]?(\d{7}|\d{3}[\s\.-]\d{2}[\s\.-]\d{2}|\d{3}-\d{4}))/
	);

	function checkData() {
		setErrors();
		let error = {}
		if (!name || name === '') {
			error.name = 'Имя не может быть пустым';
		}
		if (!surname || surname === '') {
			error.surname = 'Фамилия не может быть пустым';
		}
		if (!phoneRegex.test(phone)) {
			error.phone = 'Неверный формат номера телефона';
		}
		if (!emailRegex.test(email)) {
			error.email = 'Неверный формат электронной почты';
		}
		if (!password || password === '') {
			error.password = 'Пароль не может быть пустым';
		}
		if (!confPassword || confPassword === '') {
			error.confPassword = 'Повторите пароль';
		}
		if (password !== confPassword) {
			error.password = 'Пароли не совпадают';
			error.confPassword = 'Пароли не совпадают';
		}
		setErrors(error);
		return error;
	}

	async function handleSubmit(e) {
		e.preventDefault()
		try {
			const error = checkData()
			if (!error.name && !error.surname && !error.phone && !error.email && !error.password && !error.confPassword) {
				await app
					.auth()
					.createUserWithEmailAndPassword(email, password).then((user) => {
						console.log(user.user.uid)
						const data = {
							uid: user.user.uid,
							name: name,
							surname: surname,
							patronymic: patronymic,
							phone: phone,
							email: email,
							status: 'user'
						}
						console.log(data.uid)
						axios.post('/signup', data).then(res => {
							console.log(res)
						}).catch(err => {
							console.log(err.code)
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
		<Container sx={{ width: '100%', height: '70vh', minHeight: 500, maxHeight: 1200, display: 'block', mt: 2 }}>
			<form noValidate onSubmit={handleSubmit}>
				<Grid>
					<Grid sx={{ width: '100%', height: '100%' }}
						container rowSpacing={1} direction="column" justifyContent="flex-start" alignItems="center">
						<Typography variant='h3' sx={{ mb: '20px' }}
						>Регистрация</Typography>
					</Grid>
				</Grid>
				<Grid sx={{ width: '100%', height: '100%' }}
					container rowSpacing={1} direction="row" justifyContent="center" alignItems="flex-start" >
					<Grid item xm={6} sx={{ textAlign: 'center', width: '40%' }}>
						<TextField required sx={{ width: '90%', mb: '20px', mx: '20px' }}
							id="email" name="email" type="email" label="Электронная почта"
							helperText={errors.email}
							error={errors.email ? true : false}
							value={email} onChange={e => setEmail(e.target.value)} fullWidth
							inputProps={{
								maxLength: 40
							}} />
						<TextField required sx={{ width: '90%', mb: '20px', mx: '20px', }}
							id="password" name="password" type="password" label="Пароль"
							helperText={errors.password}
							error={errors.password ? true : false}
							value={password} onChange={e => setPassword(e.target.value)} fullWidth
							inputProps={{
								maxLength: 30
							}} />
						<TextField required sx={{ width: '90%', mb: '20px', mx: '20px', }}
							id="confPassword" name="confPassword" type="password" label="Повторите пароль"
							helperText={errors.confPassword}
							error={errors.confPassword ? true : false}
							value={confPassword} onChange={e => setConfPassword(e.target.value)} fullWidth
							inputProps={{
								maxLength: 30
							}} />
					</Grid>
					<Grid item xm={6} sx={{ textAlign: 'center', width: '40%' }}>
						<TextField required sx={{ width: '40%', mb: '20px', mx: '20px', }}
							id="name" name="name" type="text" label="Имя"
							helperText={errors.name}
							error={errors.name ? true : false}
							value={name} onChange={e => setName(e.target.value)} fullWidth
							inputProps={{
								maxLength: 30
							}} />
						<TextField required sx={{ width: '40%', mb: '20px', mx: '20px', }}
							id="surname" name="surname" type="text" label="Фамилия"
							helperText={errors.surname}
							error={errors.surname ? true : false}
							value={surname} onChange={e => setSurname(e.target.value)} fullWidth
							inputProps={{
								maxLength: 30
							}} />
						<TextField sx={{ width: '90%', mb: '20px', mx: '20px', }}
							id="patronymic" name="patronymic" type="text" label="Отчество"
							value={patronymic} onChange={e => setPatronymic(e.target.value)} fullWidth
							inputProps={{
								maxLength: 30
							}} />
						<InputMask
							value={phone}
							inputProps={{
								maxLength: 10
							}}
							onChange={(e) => { setPhone(e.target.value) }}
							mask="+38(099) 999-99-99"
							mamaskChar="_">
							{() => <TextField sx={{ width: '90%', mb: '20px', mx: '20px', }}
								helperText={errors.phone}
								error={errors.phone ? true : false}
								required id="phone" name="phone" type="text" label="Номер телефона" />}
						</InputMask>
					</Grid>
					<Grid item xs={6} sx={{ textAlign: 'center', width: '40%' }}>
						{errors.message && <Typography variant='body1' color='error' sx={{ mb: '20px' }}>{errors.message}</Typography>}
						<Button sx={{ width: 'auto', height: '40px', fontSize: '16pt', mb: '20px' }}
							type='submit' variant='contained' color='primary' >Зарегестрироваться</Button>
						<Typography variant='body1' style={{ wordWrap: "break-word", }} sx={{ mb: '20px', width: '100%' }}>
							Уже зарегестрированы?
							<Link sx={{ ml: '10px' }} variant='body1' underline="hover" component="button" onClick={() => { navigate('/login') }}>Войти</Link></Typography>
					</Grid>
				</Grid>
			</form>
		</Container >
	)
}

export default Signup;