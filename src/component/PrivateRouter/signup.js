import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Register from '../Register'

const SignUpPrivateRoute = (props) => {
    let customerData = JSON.parse(sessionStorage.getItem('gears-ctm'))

    return (
        customerData !== null && customerData.ctm_rl === 'c' ?
            <Navigate to="/" /> :
        ( customerData !== null && customerData.ctm_rl === 'a' ?
            <Navigate to="/admin" /> :
            <Register {...props} />
        )
    )
};

export default SignUpPrivateRoute;