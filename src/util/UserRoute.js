import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/Auth";

const UserRoute = ({ component: RouteComponent }) => {
	const currentUser = useContext(AuthContext);
	if (currentUser.currentUser) {
		return <RouteComponent />
	}

	return <Navigate to={"/login"} />

};

export default UserRoute