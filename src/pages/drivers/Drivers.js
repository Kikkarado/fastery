import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';

import { Container, Box, Button } from '@mui/material';
import { DataGrid, ruRU } from '@mui/x-data-grid';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const columns = [
	{
		field: 'fullName',
		headerName: 'Полное имя',
		type: 'text',
		width: 200,
		editable: false,
		flex: 1,
		headerAlign: 'center',
		align: 'center',
		valueGetter: (params) => {
			return `${params.row.surname || ''} ${params.row.name || ''} ${params.row.patronymic || ''}`
		}
	},
	{
		field: 'email',
		headerName: 'Электронная почта',
		type: 'text',
		width: 110,
		editable: false,
		flex: 1,
		headerAlign: 'center',
		align: 'center',
	},
	{
		field: 'phone',
		headerName: 'Телефон',
		type: 'text',
		width: 110,
		editable: false,
		flex: 1,
		headerAlign: 'center',
		align: 'center',
	},
	{
		field: 'currentOrderId',
		headerName: 'На заказе',
		type: 'boolean',
		width: 110,
		editable: false,
		flex: 1,
		headerAlign: 'center',
		align: 'center',
		valueGetter: (params) => {
			if (params.value !== '') {
				return true
			} else { return false }
		}
	},
	{
		field: 'employed',
		headerName: 'Трудоустроен',
		type: 'boolean',
		width: 110,
		editable: false,
		flex: 1,
		headerAlign: 'center',
		align: 'center',
	},
	{
		field: 'salary',
		headerName: 'К выплате',
		type: 'text',
		width: 110,
		editable: false,
		flex: 1,
		headerAlign: 'center',
		align: 'center',
		valueGetter: (params) => {
			return `${(parseFloat(params.row.salary) + parseFloat(params.row.premium)).toFixed(2)} грн.`
		}
	},
];

function Drivers() {

	const [drivers, setDrivers] = useState([])
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate()

	useEffect(() => {
		setLoading(true)
		axios.get('/drivers')
			.then(res => {
				if (res.data) {
					setDrivers(res.data)
				}
			}).then(() => {
				setLoading(false)
			})
			.catch(err => { console.log(err) })
	}, []);

	const handleOnClick = (rowData) => {
		navigate(`/driver/${rowData.idDriver}`)
	}

	return (
		<Container sx={{ width: '100%', height: '70vh', maxHeight: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
			{!loading ? (
				<Box sx={{ height: '100%', maxHeight: 1200, width: '100%' }}>
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
						rows={drivers}
						columns={columns}
						pageSize={10}
						rowsPerPageOptions={[10]}
						autoPageSize={true}
						disableSelectionOnClick={true}
						disableVirtualization={false}
						disableExtendRowFullWidth={false}
						disableColumnSelector={false}
						onRowDoubleClick={(param) => handleOnClick(param.row)}
						getRowId={(row) => row.idDriver} />
					<Button sx={{ mt: '20px' }}
						variant='contained' component={Link} to="/addDriver">Добавить водителя</Button>
				</Box>
			) : <div>
				<Backdrop
					sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
					open={loading}>
					<CircularProgress color="inherit" />
				</Backdrop>
			</div>}
		</Container>
	)
}

export default Drivers;