import React from 'react';
import { Link } from "react-router-dom";
import {ReactComponent as Logo } from '../assets/logo.svg'
import {ReactComponent as CartIcon} from '../assets/cart-icon.svg';
import pairShoes from '../assets/pair-shoes-small.png'

function Header(props) {
  const isThankYouPathname = props.location.pathname === '/thank-you';
  const currentFillColor = isThankYouPathname ? 'fill-cherry' : 'fill-near-white';
  const currentColor = isThankYouPathname ? 'cherry' : 'white';
  return (
    <header className="absolute w-100 ph3 ph5-ns pv3 pv5-ns flex flex-row justify-between items-center items-start-ns mt5 mt3-l z-1">
      <Link to="/">
        <div className={`logoContainer dim pointer w-70 center w-85-l ${currentFillColor}`}>
          <Logo />
        </div>
      </Link>
      <div className="flex">
        <div className="productFragmentContainer mw4">
          <button
            name="pre-order-button"
            className="absolute right-0 medium-text f7 cherry bg-blossom ttu rotate-270 pv2 ph2 bg-white outline-0 dim pointer mr3 mr5-ns mt3">
            pre-order now
          </button>
          <div className="w-100">
            <img src={pairShoes} width="100%" height="auto" />
          </div>
        </div>
        <Link to="cart-checkout" className="flex flex-row items-center no-underline dim">
          <div className={`cartIconContainer pointer ${currentFillColor}`}>
            <CartIcon />
          </div>
          <p className={`medium-text f7 ${currentColor}`}>
            {props.cart ? props.cart.total_items : '0'}
          </p>
        </Link>
      </div>
    </header>
  )
}

export default Header;
