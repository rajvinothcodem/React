import { render } from '@testing-library/react';
import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter as Router, Route, Link, NavLink, Routes } from 'react-router-dom';
import App from './../App';
import Cart from './../cart/Cart';
import './Styles.css'
function Menu() {
    return (
        <header className="App-header">
            <ul className="navigation">
                <li><NavLink to="/" activeclassname="active">Home</NavLink> </li>
                <li><NavLink to="/cart" activeclassname="active">Cart</NavLink></li>
                {/* <li><NavLink to="/contact" exact >Contact</NavLink></li>   */}
            </ul>
        </header>
    );
}
export default Menu;


