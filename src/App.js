import React from 'react';
import './App.css';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';

import { ThemeProvider } from '@mui/material/styles';
import theme from './util/theme';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Users from './pages/users/Users';
import Profile from './pages/users/Profile';
import MakeOrder from './pages/orders/MakeOrder';
import Orders from './pages/orders/Orders';
import Drivers from './pages/drivers/Drivers';
import AddDriver from './pages/drivers/AddDriver';
import DriverProfile from './pages/drivers/DriverProfile';
import OrderData from './pages/orders/OrderData';
import About from './pages/About';

import { AuthProvider } from './context/Auth';
import PrivateRoute from './util/PrivateRoute';
import UserRoute from './util/UserRoute';

function App() {

	axios.defaults.baseURL = "https://europe-central2-fastery-fc957.cloudfunctions.net/api";

	return (
		<div className='main-window'>
			<AuthProvider>
				<Router>
					<ThemeProvider theme={theme}>
						<Navbar />
						<div style={{ flexGrow: '1' }}>
							<Routes >
								<Route exact path="/" element={<Home />} />
								<Route exact path="/login" element={<Login />} />
								<Route exact path="/signup" element={<Signup />} />
								<Route exact path="/about" element={<About />} />
								<Route exact path="/users" element={<PrivateRoute component={Users} />} />
								<Route exact path="/user/:id" element={<PrivateRoute component={Profile} />} />
								<Route exact path="/profile" element={<UserRoute component={Profile} />} />
								<Route exact path="/makeorder" element={<UserRoute component={MakeOrder} />} />
								<Route exact path="/orders" element={<PrivateRoute component={Orders} />} />
								<Route exact path="/drivers" element={<PrivateRoute component={Drivers} />} />
								<Route exact path="/addDriver" element={<PrivateRoute component={AddDriver} />} />
								<Route exact path="/driver/:id" element={<PrivateRoute component={DriverProfile} />} />
								<Route exact path="/order/:id" element={<UserRoute component={OrderData} />} />
								<Route exact path="*" element={<Home />} />
							</Routes>
						</div>
						<Footer />
					</ThemeProvider >
				</Router>
			</AuthProvider>
		</div>
	);
}

export default App;
