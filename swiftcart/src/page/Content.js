import { render } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router, Route, Link, NavLink, Routes } from 'react-router-dom';
import App from './../App';
import Cart from './../cart/Cart';
import Checkout from './../checkout/Checkout';
import Menu from './Menu'
import './Styles.css'
function Content() {
    return (
        <Router>
            <Menu />
            <Routes>
                <Route path="/cart/:id/:quote" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
            </Routes>
        </Router>
    );
}
export default Content;


