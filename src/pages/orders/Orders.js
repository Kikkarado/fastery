import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom';

import { Container, Box } from '@mui/material';
import { DataGrid, ruRU } from '@mui/x-data-grid';

import { AuthContext } from "../../context/Auth"

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import statuses from '../../util/statuses';

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

function Orders() {
	const [loading, setLoading] = useState(true);
	const [orders, setOrders] = useState([])
	const navigate = useNavigate()
	const params = useParams()

	const currentUser = useContext(AuthContext);

	useEffect(() => {
		setLoading(true)
		axios.get('/orders')
			.then(res => {
				if (res.data) {
					let ord = []
					res.data.map(order => {
						if (order.userId !== currentUser.currentUser.uid) {
							ord.push(order)
						}
					})
					setOrders(ord)
				}
			}).then(() => { setLoading(false) })
			.catch(err => { console.log(err) })
	}, []);

	const handleOnClick = (rowData) => {
		navigate(`/order/${rowData.orderId}`)
	}

	return (<div>
		{!loading ? (
			<Container sx={{ width: '100%', height: '70vh', maxHeight: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
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
			</Container>
		) : <div>
			<Backdrop
				sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={loading}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
		</div>
		}</div>
	)
}

export default Orders;