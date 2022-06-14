import React from 'react'
import { useNavigate } from 'react-router-dom';

import { Container, Box, Typography, Paper, Grid, Link } from '@mui/material'

function About() {

	const navigate = useNavigate();

	return (
		<Container sx={{ mt: '20px', }}>
			<Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
				<Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
					<Typography variant='h5' color='inherit' sx={{ textDecoration: 'underline' }}>Сайт создан как курсовой проект.</Typography>
				</Grid>
				<Grid item xs={12} sx={{ mt: '10px', display: 'flex', justifyContent: 'center' }}>
					<Typography variant='h6' color='inherit'>Краткая инструкция</Typography>
				</Grid>
				<Grid item xs={12} sx={{ display: 'flex' }}>
					<Typography variant='h6' color='inherit' sx={{ wordWrap: 'break-word' }} paragraph={true}>
						&nbsp;Для того, чтобы сделать заказ на перевозку необходимо войти в учётную запись либо зарегестрироваться.
					</Typography>
				</Grid>
				<Grid item xs={12} sx={{ display: 'flex' }}>
					<Typography variant='h6' color='inherit' sx={{ wordWrap: 'break-word' }} paragraph={true}>
						После того, как вы зарегестрировались или вошли в свой аккаунт, вы можете перейти на галвную страницу и нажать на ссылку "Сделать заказ".
					</Typography>
				</Grid>
				<Grid item xs={12} sx={{ display: 'flex' }}>
					<Typography variant='h6' color='inherit' sx={{ wordWrap: 'break-word' }} paragraph={true}>
						На странице необходимо заполнить все обязательные поля и нажать на кнопку "Рассчитать".
						После этого вы получите ответ о стоимости заказа и дистанции перевозки.
						Затем вы можете нажать на кнопку "Сделать заказ" и ваш заказ будет отправлен на проверку администратору.
					</Typography>
				</Grid>
				<Grid item xs={12} sx={{ display: 'flex' }}>
					<Typography variant='h6' color='inherit' sx={{ wordWrap: 'break-word' }} paragraph={true}>
						Проверить информацию заказа, а так же удалить его до проверки администратором, вы можете перейдя на страницу важего профиля.
						Во время проверки администратор свяжется с вами по указаному номеру телефона и проверит все ли данные верны.
						В случае ошибки администратор отменить заказ.
						Если заказ успешно оформлен вы сможете его оплатить на нашем сайте и отслеживать всю историю заказа.
					</Typography>
				</Grid>
			</Grid>
		</Container>
	)
}

export default About