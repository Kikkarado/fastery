import React, { Fragment, useContext } from 'react'
import { Link } from 'react-router-dom';
import { AuthContext } from "../../context/Auth.js";

import { Box, AppBar, Toolbar, Typography, Button, Drawer, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import LoginIcon from '@mui/icons-material/Login';
import MenuIcon from '@mui/icons-material/Menu';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import GroupIcon from '@mui/icons-material/Group';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import DriveEtaIcon from '@mui/icons-material/DriveEta';

export default function Navbar() {
	const currentUser = useContext(AuthContext);

	const [state, setState] = React.useState({ left: false });
	const admin = currentUser.status.status === 'admin' ? true : false;
	const auth = currentUser.currentUser;

	const toggleDrawer = (anchor, open) => (event) => {
		if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			return;
		}

		setState({ ...state, [anchor]: open });
	};

	const list = (anchor) => (
		<Box
			sx={{ width: 250 }}
			role="presentation"
			onClick={toggleDrawer(anchor, false)}
			onKeyDown={toggleDrawer(anchor, false)}>
			<List>
				<ListItem disablePadding>
					<ListItemButton component={Link} to="/users">
						<ListItemIcon>
							<GroupIcon />
						</ListItemIcon>
						<ListItemText primary="Пользователи" />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton component={Link} to="/orders">
						<ListItemIcon>
							<PlaylistAddCheckIcon />
						</ListItemIcon>
						<ListItemText primary="Заказы" />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton component={Link} to="/drivers">
						<ListItemIcon>
							<DriveEtaIcon />
						</ListItemIcon>
						<ListItemText primary="Водители" />
					</ListItemButton>
				</ListItem>
			</List>
			<Divider />
		</Box>
	);

	return (
		<Box sx={{ width: '100%' }} >
			<AppBar sx={{ display: 'flex', height: 60 }}
				position="static" >
				<Toolbar>
					{admin ? (<div>
						{['left'].map((anchor) => (
							<Fragment key={anchor}>
								<Button onClick={toggleDrawer(anchor, true)} color="inherit" startIcon={<MenuIcon />}></Button>
								<Drawer
									anchor={anchor}
									open={state[anchor]}
									onClose={toggleDrawer(anchor, false)}
								>
									{list(anchor)}
								</Drawer>
							</Fragment>
						))}
					</div>) : null}
					<Button style={{ fontSize: '16pt' }} sx={{ width: 120, borderRadius: 0, ml: 1 }} color="inherit" component={Link} to="/">Fastery</Button>
					<Typography component="div" sx={{ flexGrow: 1 }} />
					{!auth ? (<div>
						<Button style={{ fontSize: '12pt' }}
							sx={{ width: 'auto', borderRadius: 1 }}
							variant="text" color="inherit"
							startIcon={<HowToRegIcon />}
							component={Link} to="/signup">Зарегестрироваться</Button>
						<Button style={{ fontSize: '12pt' }}
							sx={{ width: 120, borderRadius: 1, ml: 2 }}
							variant="outlined" color="inherit"
							startIcon={<LoginIcon />}
							component={Link} to="/login">Войти</Button>
					</div>) : (
						<Button style={{ fontSize: '12pt' }}
							sx={{ width: 120, borderRadius: 1, ml: 2 }}
							variant="text" color="inherit"
							startIcon={<AccountBoxIcon />}
							component={Link} to="/profile"
						// onClick={logout}
						>Профиль</Button>
					)}
				</Toolbar>
			</AppBar>
		</Box>
	)
}
