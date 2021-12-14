import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Admin from "../Admin/Main";

const AdminPrivateRoute = (props) => {
    let customerData = JSON.parse(sessionStorage.getItem('gears-ctm'))

    return (
        customerData && customerData.ctm_rl === 'a' ?
            <Admin {...props} /> : 
            <Navigate to="/login" />
    )
};

export default AdminPrivateRoute;