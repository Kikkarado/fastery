import { createTheme } from '@mui/material/styles';

export default createTheme({
	palette: {
		type: 'light',
		primary: {
			main: '#3848d2',
			light: '#5f6cdb',
			dark: '#273293',
			contrastText: '#ffffff',
		},
		secondary: {
			main: '#38d2c3',
			light: '#5fdbcf',
			dark: '#279388',
			contrastText: 'rgba(0,0,0,0.87)',
		},
		warning: {
			main: '#ff9800',
			light: '#ffac33',
			dark: '#b26a00',
			contrastText: 'rgba(0,0,0,0.87)',
		},
		text: {
			primary: 'rgba(0,0,0,0.87)',
			secondary: 'rgba(0,0,0,0.54)',
			disabled: 'rgba(0,0,0,0.38)',
			hint: 'rgba(0,0,0,0.38)',
		},
		error: {
			main: '#f44336',
			light: '#f6685e',
			dark: '#aa2e25',
			contrastText: '#ffffff',
		},
		info: {
			main: '#2196f3',
			light: '#4dabf5',
			dark: '#1769aa',
			contrastText: '#ffffff',
		},
		success: {
			main: '#4caf50',
			light: '#6fbf73',
			dark: '#357a38',
			contrastText: 'rgba(0,0,0,0.87)',
		},
		divider: 'rgba(0,0,0,0.12)',
	},
	typography: {
		fontFamily: 'Roboto',
	},
	shape: {
		borderRadius: 10,
	},
});