import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';

import { Container, Box, Typography, Paper, Grid, Link } from '@mui/material'

import { AuthContext } from "../context/Auth";

function Home() {

	const navigate = useNavigate();
	const currentUser = useContext(AuthContext);

	return (
		currentUser.currentUser ? (
			<Container sx={{ mt: '20px', display: 'flex', width: '100%', height: '50vh' }}>
				<Box sx={{
					width: '100%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'flex-start',
					textAlign: 'center'
				}} justifyContent="center" alignItems="center">
					<Paper sx={{
						display: 'flex', justifyContent: 'center',
						alignItems: 'center',
					}} elevation={3}>
						<Grid>
							<Grid sx={{
								px: '20px', py: '20px',
								maxWidth: '400px',
								justifyContent: 'center',
								alignItems: 'flex-end',
							}} container rowSpacing={1} direction="column">
								<Typography variant='h4'
									style={{ wordWrap: "break-word" }}
									sx={{ mb: '20px', width: '100%' }}
									color="primary">
									<Link variant='h4' underline="hover"
										component="button"
										onClick={() => { navigate('/makeorder') }}>Сделать заказ</Link></Typography>
								<Typography variant='h5'
									style={{ wordWrap: "break-word" }}
									sx={{ mb: '20px', width: '100%' }}
									color="contrastText">Воспользуйтесь нашими услугами перевозки.
									Мы доставим ваш заказ быстро и качественно!</Typography>
							</Grid>
						</Grid>
					</Paper>
				</Box>
			</Container>
		) : (
			<Container sx={{ mt: '20px', display: 'flex', width: '100%', height: '50vh' }}>
				<Box sx={{
					width: '100%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'flex-start',
					textAlign: 'center'
				}} justifyContent="center" alignItems="center">
					<Paper sx={{
						display: 'flex', justifyContent: 'center',
						alignItems: 'center',
					}} elevation={3}>
						<Grid>
							<Grid sx={{
								px: '20px', py: '20px', maxWidth: '400px', justifyContent: 'center',
								alignItems: 'flex-end',
							}} container rowSpacing={1} direction="column">
								<Typography variant='h4' style={{ wordWrap: "break-word", }} sx={{ mb: '20px', width: '100%' }} color="primary">
									<Link variant='h4' underline="hover" component="button" onClick={() => { navigate('/signup') }}>Зарегестрироваться</Link></Typography>
								<Typography variant='h5' style={{ wordWrap: "break-word" }} sx={{ mb: '20px', width: '100%' }} color="contrastText">Зарегестрируйтесь, чтобы воспользуйтесь нашими услугами перевозки.
									Мы доставим ваш заказ быстро и качественно!</Typography>
								<Link variant='body1' underline="hover" component="button" onClick={() => { navigate('/login') }}>Войдите, если уже имеете учетную запись</Link>
							</Grid>
						</Grid>
					</Paper>
				</Box>
			</Container>
		)
	)
}

export default Home
