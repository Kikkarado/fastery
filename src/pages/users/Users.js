import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom';

import { Container, Box } from '@mui/material';
import { DataGrid, ruRU } from '@mui/x-data-grid';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { AuthContext } from "../../context/Auth"

const columns = [
	{
		field: 'fullName',
		headerName: 'Полное имя',
		description: 'This column has a value getter and is not sortable.',
		sortable: false,
		headerClassName: 'header-theme',
		minWidth: 160,
		flex: 1,
		headerAlign: 'center',
		align: 'center',
		valueGetter: (params) =>
			`${params.row.surname || ''} ${params.row.name || ''} ${params.row.patronymic || ''}`,
	},
	{
		field: 'date',
		headerName: 'Зарегестрирован',
		type: 'date',
		minWidth: 190,
		editable: false,
		headerClassName: 'header-theme',
		flex: 1,
		headerAlign: 'center',
		align: 'center',
		valueGetter: (params) => {
			return new Date(params.value._seconds * 1000);
		},
	},
	{
		field: 'email',
		headerName: 'Почта',
		minWidth: 150,
		editable: false,
		headerClassName: 'header-theme',
		flex: 1,
		headerAlign: 'center',
		align: 'center',
	},
	{
		field: 'phone',
		headerName: 'Номер телефона',
		minWidth: 150,
		editable: false,
		headerClassName: 'header-theme',
		flex: 1,
		headerAlign: 'center',
		align: 'center',
	},
];

function Users() {
	const [users, setUsers] = useState([])
	const [loading, setLoading] = useState(true)
	const navigate = useNavigate()
	const params = useParams()

	const currentUser = useContext(AuthContext);

	useEffect(() => {
		setLoading(true)
		axios.get('/users')
			.then(res => {
				if (res.data) {
					let us = []
					res.data.map(user => {
						if (user.userId !== currentUser.currentUser.uid) {
							us.push(user)
						}
					})
					setUsers(us)
				}
			}).then(() => { setLoading(false) })
			.catch(err => { console.log(err) })
	}, []);

	const handleOnClick = (rowData) => {
		navigate(`/user/${rowData.userId}`)
	}

	return (<div>
		{!loading ? (<Container sx={{ width: '100%', height: '70vh', maxHeight: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
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
					rows={users}
					columns={columns}
					pageSize={10}
					rowsPerPageOptions={[10]}
					autoPageSize={true}
					disableSelectionOnClick={true}
					disableVirtualization={false}
					disableExtendRowFullWidth={false}
					disableColumnSelector={false}
					onRowDoubleClick={(param) => handleOnClick(param.row)}
					getRowId={(row) => row.userId}
				/>
			</Box>
		</Container>) : <div>
			<Backdrop
				sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={loading}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</div>}
	</div>
	)
}

export default Users;