import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import ShopingCart from '../Client/Cart'

const CartPrivateRoute = (props) => {
    let customerData = JSON.parse(sessionStorage.getItem('gears-ctm'))

    return (
        customerData && customerData.ctm_rl === 'c' ?
            <ShopingCart {...props} /> : 
            <Navigate to="/login" />
    )
};

export default CartPrivateRoute;