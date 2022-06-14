import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

import { Container, Box, Paper, Grid, Typography, TextField, Button } from '@mui/material'

import InputMask from "react-input-mask";

function AddDriver() {

	const navigate = useNavigate();

	const [name, setName] = useState('');
	const [surname, setSurname] = useState('');
	const [patronymic, setPatronymic] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');

	const [errors, setErrors] = useState({});

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
		if (!emailRegex.test(email)) {
			error.email = 'Неверный формат электронной почты';
		}
		if (!phoneRegex.test(phone)) {
			error.phone = 'Неверный формат номера телефона';
		}
		setErrors(error);
		return error;
	}

	function handleSubmit(e) {
		const error = checkData()
		if (!error.mame && !error.surname && !error.email && !error.phone) {
			const data = {
				name: name,
				surname: surname,
				patronymic: patronymic,
				email: email,
				phone: phone,
			}
			axios.post('/addDriver', data)
				.then(res => {
					console.log(res)
				}).then(() => {
					navigate('/drivers');
				}).catch(err => {
					console.log(err)
				})
			console.log('Данные валидны');
		} else {

		}
	}

	return (
		<Container sx={{ mt: '20px', display: 'flex', width: '100%', height: 'auto', justifyContent: 'center' }}>
			<Paper elevation={3} sx={{ display: 'flex', width: '50%', height: 'auto', justifyContent: 'center' }}>
				<Box sx={{ flexGrow: 1 }}>
					<Grid container spacing={0}>
						<Grid item xs={12} sx={{ textAlign: 'center', my: '20px' }}>
							<Typography variant='h5' style={{ wordWrap: "break-word" }} sx={{ width: '100%' }} color="contrastText">
								Введите данные водителя</Typography>
						</Grid>
						<Grid item xs={6} sx={{ px: '20px', my: '10px' }}>
							<TextField required id="name" name="name" type="text" variant="standard" label="Имя" fullWidth
								inputProps={{
									maxLength: 40
								}}
								value={name}
								onChange={(e) => {
									setName(e.target.value)
								}}
								error={errors.name ? true : false}
								helperText={errors.name}></TextField>
						</Grid>
						<Grid item xs={6} sx={{ px: '20px', my: '10px' }}>
							<TextField required id="surname" name="surname" type="text" variant="standard" label="Фамилия" fullWidth
								inputProps={{
									maxLength: 40
								}}
								value={surname}
								onChange={(e) => { setSurname(e.target.value) }}
								error={errors.surname ? true : false}
								helperText={errors.surname}></TextField>
						</Grid>
						<Grid item xs={6} sx={{ px: '20px', my: '10px' }}>
							<TextField id="patronymic" name="patronymic" type="text" variant="standard" label="Отчество" fullWidth
								value={patronymic}
								inputProps={{
									maxLength: 40
								}}
								onChange={(e) => { setPatronymic(e.target.value) }} />
						</Grid>
						<Grid item xs={6} sx={{ px: '20px', my: '10px' }}>
							<TextField required id="email" name="email" type="email" variant="standard" label="Электронная почта" fullWidth
								value={email}
								inputProps={{
									maxLength: 30
								}}
								onChange={(e) => { setEmail(e.target.value) }}
								error={errors.email ? true : false}
								helperText={errors.email}></TextField>
						</Grid>
						<Grid item xs={12} sx={{ px: '20px', my: '10px' }}>
							<Box sx={{ display: 'flex', justifyContent: 'center', mb: '10px' }}>
								<InputMask
									value={phone}
									inputProps={{
										maxLength: 10
									}}
									onChange={(e) => { setPhone(e.target.value) }}
									mask="+38(099) 999-99-99"
									mamaskChar="_">
									{() => <TextField sx={{ width: '50%' }}
										error={errors.phone ? true : false}
										helperText={errors.phone}
										required id="phone" name="phone" type="text" variant="standard" label="Номер телефона" />}
								</InputMask>
							</Box>
						</Grid>
						<Grid item xs={12} sx={{ px: '20px', mt: '10px', mb: '20px', alignItems: 'center', textAlign: 'center' }}>
							<Box sx={{ display: 'flex', justifyContent: 'center', mb: '10px' }}>
								<Button variant='contained' color='primary'
									onClick={() => {
										checkData()
										handleSubmit()
									}}>
									<Typography variant='h6'>Добавить</Typography>
								</Button>
							</Box>
						</Grid>
					</Grid>
				</Box>
			</Paper>
		</Container >
	)
}

export default AddDriver