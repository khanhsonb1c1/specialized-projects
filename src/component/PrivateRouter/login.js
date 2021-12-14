import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Login from '../Login'

const LoginPrivateRoute = (props) => {
    let customerData = JSON.parse(sessionStorage.getItem('gears-ctm'))

    return (
            customerData && customerData.ctm_rl === 'c' ?
                <Navigate to="/" />
            : (
                customerData && customerData.ctm_rl === 'a' ?
                <Navigate to="/admin" /> :
                <Login {...props} />
            )
    )
};

export default LoginPrivateRoute;