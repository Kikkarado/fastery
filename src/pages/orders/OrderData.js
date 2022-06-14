import React, { useContext, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

import { AuthContext } from "../../context/Auth"

import { Container, Box, Typography, Paper, Grid, TextField } from '@mui/material'
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import TodayIcon from '@mui/icons-material/Today';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StraightenIcon from '@mui/icons-material/Straighten';
import DoneIcon from '@mui/icons-material/Done';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import DescriptionIcon from '@mui/icons-material/Description';
import LuggageIcon from '@mui/icons-material/Luggage';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import Autocomplete from '@mui/material/Autocomplete';
import PaymentIcon from '@mui/icons-material/Payment';
import DeleteIcon from '@mui/icons-material/Delete';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Divider from '@mui/material/Divider';
import Fab from '@mui/material/Fab';

import statuses from '../../util/statuses';

const steps = statuses;

function OrderData() {

	const navigate = useNavigate();
	const currentUser = useContext(AuthContext);
	const params = useParams()

	const [order, setOrder] = React.useState({});
	const [loading, setLoading] = React.useState(true);

	const [employedDrivers, setEmployedDrivers] = React.useState([]);

	const [firstDriver, setFirstDriver] = React.useState('');
	const [secondDriver, setSecondDriver] = React.useState('');

	const [errors, setErrors] = React.useState({});

	const isStepFailed = (step) => {
		return step === 6;
	};

	function checkData() {
		setErrors({});
		let error = {};

		if (!firstDriver || firstDriver === '') {
			error.firstDriver = 'Выберите водителя';
		}
		if (!secondDriver || secondDriver === '') {
			error.secondDriver = 'Выберите водителя';
		}

		setErrors(error)
		return error
	}

	const getOrderData = () => {
		setLoading(true);
		axios.post(`/order/${params.id}`).then(res => {
			setOrder(res.data)
			if (currentUser.status.status !== 'admin' && res.data.order.userId !== currentUser.currentUser.uid) {
				navigate('/')
			}
			return res.data.order
		}).then(order => {
			if (!order.approved) {
				getEmployedDrivers()
			}
		}).then(() => {
			console.log(order)
			setLoading(false)
		}).catch(err => {
			console.log(err)
		})
	};

	const getEmployedDrivers = () => {
		setLoading(true)
		axios.get('/employedDrivers').then(res => {
			setEmployedDrivers(res.data)
		}).then(() => {
			setLoading(false)
		}).catch(err => {
			console.log(err)
		})
	};

	function driversSubmit(drivers) {
		axios.post(`/addDriverToOrder/${params.id}`, drivers)
			.then(res => {
				console.log(res)
				axios.post(`/approvedOrder/${params.id}`).then(res => {
					console.log(res)
				}).catch(err => {
					console.log(err)
				})
			}).then(() => {
				getOrderData()
			}).catch(err => {
				console.log(err)
			})
	}

	const addDriver = () => {
		const error = checkData()
		if (order.order.distance > 1000) {
			if (!error.firstDriver && !error.secondDriver) {
				const drivers = {
					firstDriverId: firstDriver.idDriver,
					secondDriverId: secondDriver.idDriver
				}
				driversSubmit(drivers)
			}
		} else {
			if (!error.firstDriver) {
				const drivers = {
					firstDriverId: firstDriver.idDriver,
					secondDriverId: ''
				}
				driversSubmit(drivers)
			}
		}
	};

	const deleteOrder = () => {
		axios.post(`/deleteOrder/${params.id}`).then(res => {
			console.log(res)
			navigate('/orders')
		}).catch(err => {
			console.log(err)
		})
	};

	const rejectOrder = () => {
		axios.post(`/rejectOrder/${params.id}`).then(res => {
			console.log(res)
			navigate('/orders')
		}).catch(err => {
			console.log(err)
		})
	};

	const changeOrderStatus = () => {
		axios.post(`/changeOrderStatus/${params.id}`).then(res => {
			console.log(res)
			getOrderData();
		}).catch(err => {
			console.log(err)
		})
	};

	const closeOrder = () => {
		axios.post(`/closeOrder/${params.id}`, {
			firstDriverId: order.order.drivers.firstDriverId,
			secondDriverId: order.order.drivers.secondDriverId,
		}).then(res => {
			console.log(res)
			getOrderData();
		}).catch(err => {
			console.log(err)
		})
	};

	useEffect(() => {
		getOrderData();
	}, [])

	return (
		<Container sx={{ mt: '20px' }}>
			<Paper elevation={3} sx={{ display: 'flex' }}>
				{!loading ? (
					<Grid container>
						<Grid item xs={12} sx={{ mt: '20px', display: 'flex', justifyContent: 'center' }}>
							<Typography variant="h5">Данные о заказе</Typography>
							{order.order.approved ? (<DoneIcon sx={{ ml: '10px' }} color='success' />) : (<RemoveDoneIcon sx={{ ml: '10px' }} color='error' />)}
						</Grid>
						<Grid item xs={5.5} sx={{ mt: '10px', mb: '10px', px: '20px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', textAlign: 'end' }}>
							<Typography variant="body1" style={{ wordWrap: "break-word" }}
								sx={{}}>{order.order.origin}</Typography>
						</Grid>
						<Grid item xs={1} sx={{ mt: '10px', mb: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							<ArrowCircleRightIcon />
						</Grid>
						<Grid item xs={5.5} sx={{ mt: '10px', mb: '10px', px: '20px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', textAlign: 'start' }}>
							<Typography variant="body1" style={{ wordWrap: "break-word" }}
								sx={{}}>{order.order.destination}</Typography>
						</Grid>
						<Grid container item xs={5.5} sx={{ mt: '10px', mb: '10px', px: '20px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', textAlign: 'end' }}>
							<Grid item xs={12}>
								<Typography variant="caption" style={{ wordWrap: "break-word" }}
									sx={{ width: '100%' }}>Дата заказа</Typography>
							</Grid>
							<Grid item xs={12}>
								<Typography variant="body1" style={{ wordWrap: "break-word" }}
									sx={{ width: '100%' }}>{dayjs(order.order.openingDate._seconds * 1000).format("DD.MM.YYYY")}</Typography>
							</Grid>
						</Grid>
						<Grid item xs={1} sx={{ mt: '10px', mb: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							<TodayIcon />
						</Grid>
						<Grid container item xs={5.5} sx={{ mt: '10px', mb: '10px', px: '20px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', textAlign: 'start' }}>
							<Grid item xs={12}>
								<Typography variant="caption" style={{ wordWrap: "break-word" }}
									sx={{ width: '100%' }}>Дата закрытия</Typography>
							</Grid>
							<Grid item xs={12}>
								<Typography variant="body1" style={{ wordWrap: "break-word" }}
									sx={{ width: '100%' }}>{order.order.closingDate ? dayjs(order.order.closingDate._seconds * 1000).format("DD.MM.YYYY") : 'Ещё не закрыта'}</Typography>
							</Grid>
						</Grid>
						<Grid container item xs={5.5} sx={{ mt: '10px', mb: '10px', px: '20px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', textAlign: 'end' }}>
							<Grid item xs={12}>
								<Typography variant="caption" style={{ wordWrap: "break-word" }}
									sx={{ width: '100%' }}>Цена</Typography>
							</Grid>
							<Grid item xs={12}>
								<Typography variant="body1" style={{ wordWrap: "break-word" }}
									sx={{ width: '100%' }}>{order.order.price} грн.</Typography>
							</Grid>
						</Grid>
						<Grid item xs={1} sx={{ mt: '10px', mb: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							<AttachMoneyIcon /><StraightenIcon />
						</Grid>
						<Grid container item xs={5.5} sx={{ mt: '10px', mb: '10px', px: '20px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', textAlign: 'start' }}>
							<Grid item xs={12}>
								<Typography variant="caption" style={{ wordWrap: "break-word" }}
									sx={{ width: '100%' }}>Расстояние</Typography>
							</Grid>
							<Grid item xs={12}>
								<Typography variant="body1" style={{ wordWrap: "break-word" }}
									sx={{ width: '100%' }}>{order.order.distance} км.</Typography>
							</Grid>
						</Grid>
						<Grid container item xs={5.5} sx={{ mt: '10px', mb: '10px', px: '20px', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', textAlign: 'end' }}>
							<Grid item xs={12} sx={{ height: '20px' }}>
								<Typography variant="caption" style={{ wordWrap: "break-word" }}
									sx={{ width: '100%' }}>Груз</Typography>
							</Grid>
							<Grid item xs={12}>
								<Typography variant="body1" style={{ wordWrap: "break-word" }}
									sx={{ width: '100%' }}>{order.order.product}</Typography>
							</Grid>
						</Grid>
						<Grid item xs={1} sx={{ mt: '10px', mb: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							<LuggageIcon /><DescriptionIcon />
						</Grid>
						<Grid container item xs={5.5} sx={{ mt: '10px', mb: '10px', px: '20px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', textAlign: 'start' }}>
							<Grid item xs={12}>
								<Typography variant="caption" style={{ wordWrap: "break-word" }}
									sx={{ width: '100%' }}>Описание</Typography>
							</Grid>
							<Grid item xs={12}>
								<Typography variant="body1" style={{ wordWrap: "break-word" }}
									sx={{ width: '100%' }}>{order.order.description ? order.order.description : 'Нет описания.'}</Typography>
							</Grid>
						</Grid>
						<Grid item xs={12} sx={{ mt: '10px', mb: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							<Box sx={{ width: '100%', textAlign: 'center' }}>
								<Typography variant="body1" style={{ wordWrap: "break-word" }}
									sx={{ width: '100%', mb: '10px' }}>Статус заказа</Typography>
								{order.order.status < 5 ? (
									<Stepper activeStep={order.order.status} alternativeLabel>
										{steps.map((label, index) => {
											const labelProps = {};
											if (isStepFailed(index)) {
												labelProps.error = true;
											}
											return (
												index !== 6 ?
													<Step key={index}>
														<StepLabel {...labelProps}>
															<Typography variant="caption" style={{ wordWrap: "break-word" }}
															>{label}</Typography></StepLabel>
													</Step>
													: null
											);
										})}
									</Stepper>) : (
									order.order.status === 6 ? (
										<Stepper activeStep={order.order.status} alternativeLabel>
											{steps.map((label, index) => {
												const labelProps = {};
												if (isStepFailed(index)) {
													labelProps.error = true;
												}
												return (
													index === 6 ?
														<Step key={index}>
															<StepLabel {...labelProps}>
																<Typography variant="caption" style={{ wordWrap: "break-word" }}
																>{label}</Typography></StepLabel>
														</Step>
														: null
												);
											})}
										</Stepper>
									) : null
								)}
								{order.order.status === 5 ? (
									<Stepper activeStep={order.order.status} alternativeLabel>
										{steps.map((label, index) => {
											const labelProps = {};
											if (isStepFailed(index)) {
												labelProps.error = true;
											}
											return (
												index === 5 ?
													<Step key={index}>
														<StepLabel {...labelProps}>
															<Typography variant="caption" style={{ wordWrap: "break-word" }}
															>{label}</Typography></StepLabel>
													</Step>
													: null
											);
										})}
									</Stepper>
								) : null}
							</Box>
						</Grid>
						{!order.order.approved && currentUser.currentUser.uid === order.order.userId || order.order.status === 6 ? (
							<Grid item xs={12} sx={{ mt: '10px', mx: '20px', mb: '10px', display: 'flex', justifyContent: 'flex-end' }}>
								<Fab variant="extended" size="medium" color="error" sx={{ ml: '20px' }}
									onClick={deleteOrder}>
									<DeleteIcon />
									Удалить
								</Fab>
							</Grid>
						) : null}
						{order.order.approved && currentUser.currentUser.uid === order.order.userId && order.order.status === 1 ? (
							<Grid item xs={12} sx={{ mt: '10px', mx: '20px', mb: '10px', display: 'flex', justifyContent: 'flex-start' }}>
								<Fab variant="extended" size="medium" color="success"
									onClick={changeOrderStatus}>
									<PaymentIcon />
									Оплатить
								</Fab>
							</Grid>) : null}
						{order.order.approved && currentUser.currentUser.uid !== order.order.userId && order.order.status > 1 && order.order.status < 4 && currentUser.status.status === 'admin' ? (
							<Grid item xs={12} sx={{ mt: '10px', mx: '20px', mb: '10px', display: 'flex', justifyContent: 'flex-start' }}>
								<Fab variant="extended" size="medium" color="primary"
									onClick={changeOrderStatus}>
									<EditIcon />
									Изменить статус посылки
								</Fab>
							</Grid>) : null}
						{order.order.approved && currentUser.currentUser.uid !== order.order.userId && order.order.status === 4 && currentUser.status.status === 'admin' ? (
							<Grid item xs={12} sx={{ mt: '10px', mx: '20px', mb: '10px', display: 'flex', justifyContent: 'flex-start' }}>
								<Fab variant="extended" size="medium" color="success"
									onClick={closeOrder}>
									<CloseIcon />
									Закрыть посылку
								</Fab>
							</Grid>) : null}
						{!order.order.approved && currentUser.currentUser.uid !== order.order.userId && currentUser.status.status === 'admin' ? (
							<Grid item xs={12} sx={{ mt: '10px', mx: '20px', mb: '10px', display: 'flex', justifyContent: 'flex-start' }}>
								<Fab variant="extended" size="medium" color="success" aria-label="add" sx={{ mr: '20px' }}
									onClick={async () => {
										addDriver();
									}}>
									<DoneIcon />
									Подтвердить
								</Fab>
								{order.order.distance > 1000 ? (
									<Grid item xs={12} sx={{ display: 'flex' }}>
										<Box sx={{ mr: '20px' }}>
											<Autocomplete
												disablePortal
												onChange={(event, newValue) => {
													setFirstDriver(newValue)
												}}
												options={employedDrivers.filter(employedDrivers => employedDrivers !== secondDriver)}
												getOptionLabel={employedDrivers => (employedDrivers.fullName + ' ' + employedDrivers.email)}
												sx={{ width: 300 }}
												renderInput={(params) => <TextField {...params}
													error={errors.firstDriver ? true : false}
													helperText={errors.firstDriver}
													label="Первый водитель" />}
											/>
										</Box>
										<Box>
											<Autocomplete
												disablePortal
												onChange={(event, newValue) => {
													setSecondDriver(newValue)
												}}
												options={employedDrivers.filter(employedDrivers => employedDrivers !== firstDriver)}
												getOptionLabel={employedDrivers => (employedDrivers.fullName + ' ' + employedDrivers.email)}
												sx={{ width: 300 }}
												renderInput={(params) => <TextField {...params}
													error={errors.secondDriver ? true : false}
													helperText={errors.secondDriver}
													label="Второй водитель" />}
											/>
										</Box>
									</Grid>
								) : <Autocomplete
									disablePortal
									id="combo-box-demo"
									onChange={(event, newValue) => {
										setFirstDriver(newValue)
									}}
									options={employedDrivers}
									getOptionLabel={employedDrivers => (employedDrivers.fullName + ' ' + employedDrivers.email)}
									sx={{ width: 300 }}
									renderInput={(params) => <TextField {...params}
										error={errors.firstDriver ? true : false}
										helperText={errors.firstDriver}
										label="Первый водитель" />}
								/>}
								<Fab variant="extended" size="medium" color="error"
									onClick={rejectOrder}>
									<CloseIcon />
									Отклонить
								</Fab>
							</Grid>
						) : null}
						{currentUser.currentUser.id !== order.order.userId && currentUser.status.status === 'admin' ? (
							<Grid container>
								<Grid item xs={12}>
									<Divider light variant="middle" color="primary" >Данные пользователя</Divider>
								</Grid>
								<Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', my: '20px' }}>
									<Typography variant="h6" component={Link} to={`/user/${order.user.idUser}`}>{order.user.surname} {order.user.name} {order.user.patronymic}</Typography>
								</Grid>
								{order.order.approved && order.order.status !== 6 ? (
									<Grid container>
										<Grid item xs={12}>
											<Divider light variant="middle" color="primary" >Данные водителей</Divider>
										</Grid>
										<Grid item xs={order.secondDriver ? 6 : 12} sx={{ display: 'flex', justifyContent: 'center', my: '20px' }}>
											<Typography variant="h6" gutterBottom component={Link} to={`/driver/${order.firstDriver.idDriver}`}>{order.firstDriver.surname} {order.firstDriver.name} {order.firstDriver.patronymic}</Typography>
										</Grid>
										{order.secondDriver ? (
											<Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center', my: '20px' }}>
												<Typography variant="h6" gutterBottom component={Link} to={`/driver/${order.firstDriver.idDriver}`}>{order.secondDriver.surname} {order.secondDriver.name} {order.secondDriver.patronymic}</Typography>
											</Grid>
										) : null}
									</Grid>
								) : null
								}
							</Grid>
						)
							: null}
					</Grid>
				) : <div>
					<Backdrop
						sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
						open={loading}
					>
						<CircularProgress color="inherit" />
					</Backdrop>
				</div>}

			</Paper>
		</Container >
	)
}

export default OrderData