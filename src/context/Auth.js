import React, { useEffect, useState } from "react";
import app from "../firebase";
import axios from "axios";

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState({});
	const [status, setStatus] = useState({});
	const [pending, setPending] = useState(true);

	useEffect(() => {
		app.auth().onAuthStateChanged((user) => {
			setCurrentUser(user)

			if (user) {
				let uid = { uid: user.uid }
				axios.post('/login', uid).then(res => {
					setStatus({ status: res.data.status })
				})
			}
			setPending(false)
		});
	}, []);


	if (pending) {
		return <div>
			<Backdrop
				sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={pending}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</div>
	}

	return (
		<AuthContext.Provider
			value={{
				currentUser, status
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};