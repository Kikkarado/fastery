import React from 'react'
import { Link } from 'react-router-dom';

import { Button } from '@mui/material'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';

function Footer() {
	return (
		<Box sx={{ width: '100%', height: 60 }} >
			<AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0, height: 60 }}>
				<Toolbar sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					<Typography variant="body1" color="inherit" component={Link} to={'/about'}>О сайте</Typography>
				</Toolbar>
			</AppBar>
		</Box>
	)
}

export default Footer