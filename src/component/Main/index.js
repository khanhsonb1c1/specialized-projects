import React, {useEffect, useState} from "react";
import {
    BrowserRouter as Router, Route, Routes, Navigate
} from "react-router-dom";

import ClientHome from '../Client/Home'
import Register from '../Register'
import AdminPrivateRoute from "../PrivateRouter/admin";
import ClientProduct from '../Client/Product'
import ProductDetail from '../Client/ProductDetail'
import CartPrivateRoute from '../PrivateRouter/cart'
import LoginPrivateRoute from '../PrivateRouter/login'
import SignUpPrivateRoute from '../PrivateRouter/signup'

// window.SERVER_HOST = "http://localhost:5005";
window.SERVER_HOST = "https://sontestshop1.herokuapp.com"



<<<<<<< HEAD
=======
window.SERVER_HOST = "https://sontestshop1.herokuapp.com"
>>>>>>> 2dff5b45467a587bcf3e073dc432f9407591ea17


export default function MainApp(props) {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<ClientHome {...props} />} />

                <Route path="/login" element={<LoginPrivateRoute {...props}/>} />

                <Route path="/signup" element={<SignUpPrivateRoute {...props} />}/> 

                <Route path="/product" element={<ClientProduct {...props} />}/> 

                <Route path="/product/:productId" element={<ProductDetail {...props} />}/> 
                
                <Route path="/cart" element={<CartPrivateRoute {...props} />}/> 

                <Route path="/admin" element={<AdminPrivateRoute {...props} />}/>
            </Routes>
        </Router>
        // <WelcomeHome {...props} />
    );
}
