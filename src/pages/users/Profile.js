import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import app from "../../firebase";
import axios from 'axios';

import { AuthContext } from "../../context/Auth";

import { Container, Box, Typography, Button, Paper, Grid, TextField } from '@mui/material'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import InputMask from "react-input-mask";

import { DataGrid, ruRU } from '@mui/x-data-grid';

import statuses from '../../util/statuses';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const columns = [
	{
		field: 'origin',
		headerName: 'Откуда',
		width: 150,
		editable: false,
		flex: 1,
		headerAlign: 'center',
		align: 'center',
	},
	{
		field: 'destination',
		headerName: 'Куда',
		width: 150,
		editable: false,
		flex: 1,
		headerAlign: 'center',
		align: 'center',
	},
	{
		field: 'openingDate',
		headerName: 'Дата оформления',
		type: 'date',
		width: 110,
		editable: false,
		flex: 1,
		headerAlign: 'center',
		align: 'center',
		valueGetter: (params) => {
			return new Date(params.value._seconds * 1000);
		},
	},
	{
		field: 'closingDate',
		headerName: 'Дата закрытия',
		type: 'date',
		width: 110,
		editable: false,
		flex: 1,
		headerAlign: 'center',
		align: 'center',
		valueGetter: (params) => {
			if (params.value) {
				return new Date(params.value._seconds * 1000);
			} else { return 'Не закрыта' }
		},
	},
	{
		field: 'status',
		headerName: 'Статус',
		type: 'text',
		width: 110,
		editable: false,
		flex: 1,
		headerAlign: 'center',
		align: 'center',
		valueGetter: (params) => {
			return statuses[params.value];
		},
	},
	{
		field: 'approved',
		headerName: 'Проверен',
		type: 'boolean',
		width: 110,
		editable: false,
		flex: 1,
		headerAlign: 'center',
		align: 'center',
	},
];

function Profile() {

	const navigate = useNavigate();
	const currentUser = useContext(AuthContext);
	const params = useParams()

	const [name, setName] = useState('');
	const [surname, setSurname] = useState('');
	const [patronymic, setPatronymic] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');

	const [loading, setLoading] = useState(true);

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

	const logout = async () => {
		await app.auth().signOut(app.auth);
		currentUser.status.status = '';
	};

	const handleOnClick = (rowData) => {
		navigate(`/order/${rowData.orderId}`)
	}

	const handleChange = (event) => {
		setStatus(event.target.value);
	};

	const [user, setUser] = useState({});
	const [orders, setOrders] = useState({});
	const [status, setStatus] = useState('');

	const getDataPOST = (url) => {
		axios.post(url, { uid: currentUser.currentUser.uid })
			.then(res => {
				setUser(res.data.user);
				setOrders(res.data.orders);
				setStatus(res.data.user.status);
				setName(res.data.user.name)
				setSurname(res.data.user.surname)
				setPatronymic(res.data.user.patronymic)
				setEmail(res.data.user.email)
				setPhone(res.data.user.phone)
			}).then(() => setLoading(false))
	};

	const getDataGET = (url) => {
		axios.get(url, { uid: currentUser.currentUser.uid })
			.then(res => {
				setUser(res.data.user);
				setOrders(res.data.orders);
				setStatus(res.data.user.status);
				setName(res.data.user.name)
				setSurname(res.data.user.surname)
				setPatronymic(res.data.user.patronymic)
				setEmail(res.data.user.email)
				setPhone(res.data.user.phone)
			}).then(() => setLoading(false))
	};

	const changeUserStatus = () => {
		axios.post(`/changeUserStatus/${params.id}`, { status: status })
			.then(res => {
				console.log(res);
			})
			.catch(err => {
				console.log(err);
			})
	};

	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const updateProfile = () => {
		const error = checkData()
		if (!error.mame && !error.surname && !error.email && !error.phone) {
			const data = {
				uid: currentUser.currentUser.uid,
				name: name,
				surname: surname,
				patronymic: patronymic,
				email: email,
				phone: phone,
			}
			axios.post(`/updateProfile`, data)
				.then(res => {
					console.log(res)
				}).then(() => {
					gateData()
					handleClose()
					setLoading(false)
				}).catch(err => {
					console.log(err)
				})
		}
	};

	function gateData() {
		let url = null
		if (params.id) {
			url = `/user/${params.id}`;
			getDataGET(url);
		} else {
			url = `/profile`;
			getDataPOST(url);
		}
	}

	useEffect(() => {
		setLoading(true)
		gateData()
	}, []);

	return (currentUser.currentUser.uid === params.id ? (
		navigate('/profile')
	) : (<div>
		{!loading ? (
			<Container sx={{
				mt: '20px', display: 'flex', width: '100%', height: '70vh',
				justifyContent: 'center',
				'&.MuiContainer-root': {
					maxWidth: '1700px',
				}
			}} >
				<Paper elevation={3} sx={{ display: 'flex', width: '100%' }}>
					<Box sx={{ flexGrow: 1, width: '100%' }}>
						<Grid container spacing={0} sx={{ height: '100%', px: '20px', py: '20px' }}>
							<Grid item xs={4} sx={{ width: '100%', alignItems: 'center', pr: '10px' }}>
								<Paper elevation={2} sx={{ display: 'flex', width: '100%', height: 'auto', alignItems: 'center' }}>
									<Box sx={{ flexGrow: 1, width: '100%', mx: '20px', my: '20px', textAlign: 'center' }}>
										<Typography variant='h6' sx={{ mb: '20px' }}
											style={{ wordWrap: "break-word" }}>{user.surname} {user.name} {user.patronymic}</Typography>
										<Typography variant='h6' sx={{ mb: '20px' }}
											style={{ wordWrap: "break-word" }}>{user.email}</Typography>
										<Typography variant='h6' sx={{ mb: '20px' }}
											style={{ wordWrap: "break-word" }}>{user.phone}</Typography>
										{!params.id ? (<div>
											<Button variant='outlined' sx={{ mr: '10px' }}
												onClick={handleClickOpen}><Typography variant='body1'>Редактировать</Typography></Button>
											<Button variant='contained' sx={{ ml: '10px' }} onClick={logout}><Typography variant='body1'>Выйти</Typography></Button>
										</div>
										) : null}
										{currentUser.currentUser.uid !== user.uid
											? (
												<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
													<FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
														<InputLabel id="demo-simple-select-standard-label">Статус</InputLabel>
														<Select
															labelId="demo-simple-select-standard-label"
															id="demo-simple-select-standard"
															value={status}
															onChange={handleChange}
															label="Status"
														>
															<MenuItem value='user'>Пользователь</MenuItem>
															<MenuItem value='admin'>Администратор</MenuItem>
														</Select>
													</FormControl>
													<Button variant='outlined' sx={{ ml: '10px' }} onClick={changeUserStatus}><Typography variant='body1'>Сохранить</Typography></Button>
												</Box>
											)
											: null}
									</Box>
								</Paper>
							</Grid>
							<Grid item xs={8} sx={{ pl: '10px' }}>
								<Box sx={{ flexGrow: 1, width: '100%', height: '100%', maxHeight: 1200, }}>
									<DataGrid sx={{
										boxShadow: 2,
										border: 0,
										fontSize: 16,
										'& .MuiDataGrid-row:hover': {
											backgroundColor: 'secondary.light',
											color: 'secondary.contrastText',
										},
										'& .MuiDataGrid-cell:hover': {
											color: 'primary.dark',
										},
										'& .MuiDataGrid-columnHeader': {
											backgroundColor: 'secondary.main',
											color: 'secondary.contrastText',
										},
									}}
										localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
										rows={orders}
										columns={columns}
										pageSize={10}
										rowsPerPageOptions={[10]}
										autoPageSize={true}
										disableSelectionOnClick={true}
										disableVirtualization={false}
										disableExtendRowFullWidth={false}
										disableColumnSelector={false}
										onRowDoubleClick={(param) => handleOnClick(param.row)}
										getRowId={(row) => row.orderId}
									/>
								</Box>
							</Grid>
						</Grid>
					</Box>
				</Paper>
				<div>
					<Dialog open={open} onClose={handleClose}>
						<DialogTitle sx={{ textAlign: 'center' }}><Typography variant='h5' style={{ wordWrap: "break-word" }} sx={{ width: '100%' }} color="contrastText">
							Введите новые данные "{user.surname} {user.name} {user.patronymic}"</Typography></DialogTitle>
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
								updateProfile()
							}}>Сохранить</Button>
						</DialogActions>
					</Dialog>
				</div>
			</Container>
		) : <div>
			<Backdrop
				sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={loading}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
		</div>}
	</div>
	)
	)
}

export default Profile