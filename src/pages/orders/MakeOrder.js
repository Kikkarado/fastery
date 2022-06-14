import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

import { Container, Box, Paper, Grid, Typography, TextField, Button } from '@mui/material'

import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';

import { AuthContext } from "../../context/Auth"

function Order() {

	const navigate = useNavigate();
	const currentUser = useContext(AuthContext);

	const libraries = ['places'];
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: process.env.REACT_APP_API_KEY,
		libraries,
	});
	const [origin, setOrigin] = React.useState('');
	const [destination, setDestination] = React.useState('');
	const [product, setProduct] = React.useState('');
	const [weight, setWeight] = React.useState(0);
	const [description, setDescription] = React.useState('');
	const [price, setPrice] = React.useState(0);
	const [errors, setErrors] = React.useState({});

	const [distance, setDistance] = React.useState(0);

	const [validData, setValidData] = React.useState(false);

	React.useEffect(() => {
		setValidData(false)
	}, [])

	if (!isLoaded) return <div>Loading...</div>;

	async function calculateDistance() {
		const directionsService = new window.google.maps.DirectionsService();
		const results = await directionsService.route({
			origin: origin,
			destination: destination,
			travelMode: window.google.maps.TravelMode.DRIVING,
		})
		setDistance(results.routes[0].legs[0].distance.value / 1000)
	}

	function calculatePrice() {
		if (origin !== '' && destination !== '' && product !== '' && weight !== '0' && distance !== '0') {
			calculateDistance()
			const price = parseFloat(distance) * 7 + parseFloat(weight) * 5
			setPrice(parseFloat(price).toFixed(2))
			setValidData(true)
		}
		else {
			setValidData(false)
		}
	}

	function checkData() {
		setErrors({})
		let error = {}
		if (!origin || origin === '') {
			error.origin = 'Введите место отправления'
		}
		if (!destination || destination === '') {
			error.destination = 'Введите место назначения'
		}
		if (!product || product === '') {
			error.product = 'Введите наименование товара'
		}
		if (!weight || weight === '0') {
			error.weight = 'Введите вес товара'
		}
		if (!weight || weight > 1000) {
			error.weight = 'Вес товара не должен превышать 1000 кг'
		}
		setErrors(error)
		return error
	}

	function handleSubmit() {
		const error = checkData()
		if (!error.origin && !error.destination && !error.product && !error.weight) {
			const order = {
				uid: currentUser.currentUser.uid,
				origin: origin,
				destination: destination,
				product: product,
				weight: parseFloat(weight).toFixed(2),
				description: description,
				price: parseFloat(price).toFixed(2),
				distance: parseFloat(distance).toFixed(2),
			}
			axios.post('/makeorder', order).then(res => {
				console.log(res)
			}).then(() => {
				navigate('/profile')
			}).catch(err => {
				console.log(err)
			})
		}
	}

	return (
		<Container sx={{ mt: '20px', display: 'flex', width: '100%', height: 'auto', justifyContent: 'center' }}>
			<Paper elevation={3} sx={{ display: 'flex', width: '50%', height: 'auto', justifyContent: 'center' }}>
				<Box sx={{ flexGrow: 1 }}>
					<Grid container spacing={0}>
						<Grid item xs={12} sx={{ textAlign: 'center', my: '20px' }}>
							<Typography variant='h5' style={{ wordWrap: "break-word" }} sx={{ width: '100%' }} color="contrastText">
								Введите данные заказа</Typography>
						</Grid>
						<Grid item xs={6} sx={{ px: '20px', my: '10px' }}>
							<Autocomplete options={{ componentRestrictions: { country: "ua" } }}>
								<TextField required id="origin" name="origin" type="text" variant="standard" label="Откуда" fullWidth
									inputProps={{
										maxLength: 40
									}}
									value={origin}
									onBlur={(e) => {
										setOrigin(e.target.value)
										calculateDistance()
									}}
									onChange={(e) => {
										setOrigin(e.target.value)
									}}
									error={errors.origin ? true : false}
									helperText={errors.origin}></TextField>
							</Autocomplete>
						</Grid>
						<Grid item xs={6} sx={{ px: '20px', my: '10px' }}>
							<Autocomplete options={{ componentRestrictions: { country: "ua" } }}>
								<TextField required id="destination" name="destination" type="text" variant="standard" label="Куда" fullWidth
									inputProps={{
										maxLength: 40
									}}
									value={destination}
									onBlur={(e) => {
										setDestination(e.target.value)
										calculateDistance()
									}}
									onChange={(e) => {
										setDestination(e.target.value)
									}}
									error={errors.destination ? true : false}
									helperText={errors.destination}></TextField>
							</Autocomplete>
						</Grid>
						<Grid item xs={9} sx={{ px: '20px', my: '10px' }}>
							<TextField required id="product" name="product" type="text" variant="standard" label="Груз" fullWidth
								value={product}
								inputProps={{
									maxLength: 40
								}}
								onBlur={() => { calculateDistance() }}
								onChange={(e) => {
									setProduct(e.target.value)
								}}
								error={errors.product ? true : false}
								helperText={errors.product}></TextField>
						</Grid>
						<Grid item xs={3} sx={{ px: '20px', my: '10px' }}>
							<TextField required id="weight" name="weight" type="number" variant="standard" label="Вес" fullWidth
								value={weight}
								inputProps={{
									max: 1000,
									min: 0,
									step: 0.1
								}}
								onBlur={() => { calculateDistance() }}
								onChange={(e) => {
									setWeight(e.target.value)
								}}
								error={errors.weight ? true : false}
								helperText={errors.weight}></TextField>
						</Grid>
						<Grid item xs={12} sx={{ px: '20px', my: '10px' }}>
							<TextField id="description" name="description" type="text" variant="outlined" label="Описание" fullWidth
								multiline
								maxRows={4}
								value={description}
								inputProps={{
									maxLength: 300
								}}
								onBlur={() => { calculateDistance() }}
								onChange={(e) => { setDescription(e.target.value) }}></TextField>
						</Grid>
						<Grid item xs={12} sx={{ px: '20px', mt: '10px', mb: '20px', alignItems: 'center', textAlign: 'center' }}>
							<Typography variant='h6'>Расчитайте стоимость доставки</Typography>
							<Box sx={{ display: 'flex', justifyContent: 'center', mb: '10px' }}>
								<Button variant='contained' color='primary'
									onClick={() => {
										calculatePrice()
										setErrors({})
										checkData()
									}}>
									<Typography variant='h5'>Расчитать</Typography>
								</Button>
							</Box>
							<Typography variant='body1'>Расстояние {distance} км. Цена {price} грн.</Typography>
							<Box sx={{ display: 'flex', justifyContent: 'center' }}>
								<Button variant='contained' color='primary' disabled={!validData}
									onClick={() => {
										handleSubmit()
										checkData()
									}}>
									<Typography variant='h5'>Сделать заказ</Typography>
								</Button>
							</Box>
						</Grid>
					</Grid>
				</Box>
			</Paper>
		</Container >
	)
}

export default Order