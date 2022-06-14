import React, { Component, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

import { AuthContext } from "../../context/Auth"

import { Container, Box, Typography, Button, Paper, Grid, TextField } from '@mui/material'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import InputMask from "react-input-mask";

function DriverProfile() {

	const navigate = useNavigate();
	const currentUser = useContext(AuthContext);
	const params = useParams()
	const [driver, setDriver] = useState({})
	const [open, setOpen] = React.useState(false);
	const [loading, setLoading] = useState(true);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	function getDriverData() {
		axios.post(`/driver/${params.id}`)
			.then(res => {
				setDriver(res.data)
				setName(driver.name)
				setSurname(driver.surname)
				setPatronymic(driver.patronymic)
				setEmail(driver.email)
				setPhone(driver.phone)
			}).then(() => {
				setLoading(false)
			})
			.catch(err => console.log(err))
	}

	function dismiss() {
		axios.post(`/dismissDriver/${params.id}`).then(res => {
			console.log(res)
			navigate('/drivers')
		}).catch(err => console.log(err))
	}

	function paySalary() {
		axios.post(`/paySalary/${params.id}`).then(res => {
			console.log(res)
			navigate('/drivers')
		}).catch(err => console.log(err))
	}

	const [name, setName] = useState('');
	const [surname, setSurname] = useState('');
	const [patronymic, setPatronymic] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');

	const [errors, setErrors] = useState({});
	const [validData, setValidData] = React.useState(true);

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
			setValidData(false)
		}
		if (!surname || surname === '') {
			error.surname = 'Фамилия не может быть пустым';
			setValidData(false)
		}
		if (!emailRegex.test(email)) {
			error.email = 'Неверный формат электронной почты';
			setValidData(false)
		}
		if (!phoneRegex.test(phone)) {
			error.phone = 'Неверный формат номера телефона';
			setValidData(false)
		}

		setErrors(error);
		return error;
	}

	function handleSubmit() {
		const error = checkData()
		if (!error.mame && !error.surname && !error.email && !error.phone) {
			const data = {
				name: name,
				surname: surname,
				patronymic: patronymic,
				email: email,
				phone: phone,
			}
			axios.post(`/updateDriver/${params.id}`, data)
				.then(res => {
					console.log(res)
				}).then(() => {
					getDriverData()
					handleClose()
					setLoading(false)
				}).catch(err => {
					console.log(err)
				})
		}
	}

	useEffect(() => {
		setLoading(true)
		getDriverData()
	}, [])

	return (
		<Container sx={{
			mt: '20px', display: 'flex', width: '50%',
			justifyContent: 'center',
		}} >
			{!loading ? (<div>
				<Paper elevation={3} sx={{ display: 'flex', width: '100%' }}>

					<Box sx={{ flexGrow: 1 }}>
						<Grid container >
							<Grid item xs={12} sx={{ pt: '20px', px: '20px', pb: '10px', textAlign: 'center' }}>
								<Box>
									<Typography style={{ wordWrap: "break-word" }} variant="h5">{driver.surname} {driver.name} {driver.patronymic}</Typography>
								</Box>
							</Grid>
							<Grid item xs={6} sx={{ py: '10px', px: '20px', textAlign: 'end' }}>
								<Typography style={{ wordWrap: "break-word" }} variant="h6">{driver.email}</Typography>
							</Grid>
							<Grid item xs={6} sx={{ py: '10px', px: '20px', textAlign: 'start' }}>
								<Typography style={{ wordWrap: "break-word" }} variant="h6">{driver.phone}</Typography>
							</Grid>
							<Grid item xs={6} sx={{ py: '10px', px: '20px', textAlign: 'end' }}>
								<Typography style={{ wordWrap: "break-word" }} variant="h6">Выполнено заказов: {driver.completedOrders}</Typography>
							</Grid>
							<Grid item xs={6} sx={{ py: '10px', px: '20px', textAlign: 'start' }}>
								{driver.currentOrderId !== '' ? (
									<Typography style={{ wordWrap: "break-word" }} variant="h6" component={Link} to={`/order/${driver.currentOrderId}`}>Текущий заказ</Typography>
								) : (
									<Typography style={{ wordWrap: "break-word" }} variant="h6" color='error'>Нет текущего заказа </Typography>
								)}
							</Grid>
							<Grid item xs={6} sx={{ py: '10px', px: '20px', textAlign: 'end' }}>
								<Typography style={{ wordWrap: "break-word" }} variant="h6">Зарплата: {parseFloat(driver.salary).toFixed(2)}</Typography>
							</Grid>
							<Grid item xs={6} sx={{ py: '10px', px: '20px', textAlign: 'start' }}>
								<Typography style={{ wordWrap: "break-word" }} variant="h6">Премия: {parseFloat(driver.premium).toFixed(2)}</Typography>
							</Grid>
							<Grid item xs={12} sx={{ py: '10px', px: '20px', textAlign: 'center' }}>
								<Typography style={{ wordWrap: "break-word" }} variant="h6">К выплате {(parseFloat(driver.salary) + parseFloat(driver.premium)).toFixed(2)}</Typography>
							</Grid>
							<Grid item xs={4} sx={{ display: 'flex', py: '20px', px: '20px', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
								{driver.employed
									? (<Button variant='outlined' color='error' onClick={dismiss}
										disabled={driver.currentOrderId !== '' || (parseFloat(driver.salary) + parseFloat(driver.premium)) > 0 ? true : false}>
										<Typography style={{ wordWrap: "break-word", fontWeight: '400' }} variant="h6">Уволить</Typography>
									</Button>)
									: (<Button variant='outlined' color='success' onClick={dismiss}>
										<Typography style={{ wordWrap: "break-word", fontWeight: '400' }} variant="h6">Взять на работу</Typography>
									</Button>)}
							</Grid>
							<Grid item xs={4} sx={{ display: 'flex', py: '20px', px: '20px', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
								<Button variant='contained' color='primary'>
									<Typography style={{ wordWrap: "break-word", fontWeight: '400' }} variant="h6"
										onClick={() => {
											getDriverData()
											handleClickOpen()
										}}>
										Редактировать</Typography>
								</Button>
							</Grid>
							<Grid item xs={4} sx={{ display: 'flex', py: '20px', px: '20px', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
								<Button variant='contained' color='success' disabled={parseFloat(driver.salary) + parseFloat(driver.premium) > 0 ? false : true}
									onClick={paySalary}>
									<Typography style={{ wordWrap: "break-word", fontWeight: '400' }} variant="h6">
										Выплатить зарплату</Typography>
								</Button>
							</Grid>
						</Grid>
					</Box>
				</Paper>
				<div>
					<Dialog open={open} onClose={handleClose}>
						<DialogTitle sx={{ textAlign: 'center' }}><Typography variant='h5' style={{ wordWrap: "break-word" }} sx={{ width: '100%' }} color="contrastText">
							Введите новые данные "{driver.surname} {driver.name} {driver.patronymic}"</Typography></DialogTitle>
						<DialogContent>
							<Box sx={{ flexGrow: 1 }}>
								<Grid container spacing={0}>
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
												mamaskChar="_"
											>
												{() => <TextField sx={{ width: '50%' }}
													error={errors.phone ? true : false}
													helperText={errors.phone}
													required id="phone" name="phone" type="text" variant="standard" label="Номер телефона" />}
											</InputMask>
										</Box>
									</Grid>
								</Grid>
							</Box>
						</DialogContent>
						<DialogActions>
							<Button onClick={handleClose}>Отмена</Button>
							<Button onClick={() => {
								checkData()
								handleSubmit()
							}}>Сохранить</Button>
						</DialogActions>
					</Dialog>
				</div>
			</div>) : <div>
				<Backdrop
					sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
					open={loading}
				>
					<CircularProgress color="inherit" />
				</Backdrop>
			</div>}
		</Container>
	)
}

export default DriverProfile