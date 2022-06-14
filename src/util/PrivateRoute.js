import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/Auth";

const PrivateRoute = ({ component: RouteComponent }) => {
	const currentUser = useContext(AuthContext);
	if (currentUser.currentUser && currentUser.status.status === 'admin') {
		return <RouteComponent />
	}

	return <Navigate to={"/login"} />

};

export default PrivateRoute