import React from 'react';
import { Link } from "react-router-dom";
import {ReactComponent as Logo } from '../assets/logo.svg'
import {ReactComponent as CartIcon} from '../assets/cart-icon.svg';
import pairShoes from '../assets/pair-shoes-small.png'

function Header(props) {
  return (
    <header className="absolute w-100 ph5 pv5 flex flex-row justify-between mt3 z-1">
      <Link to="/">
        <div className="logoContainer dim pointer">
          <Logo />
        </div>
      </Link>
      <div className="flex">
        <div className="productFragmentContainer mw4">
          <button
            name="pre-order-button"
            className="absolute right-0 medium-text f7 cherry bg-blossom ttu rotate-270 pv2 ph2 bg-white outline-0 dim pointer mr5 mt3">
            pre-order now
          </button>
          <div className="w-100">
            <img src={pairShoes} width="100%" height="auto" />
          </div>
        </div>
        <div className="flex flex-row items-center">
          <div className="cartIconContainer pointer">
            <CartIcon />
          </div>
          <p className="medium-text f7 white">
            {props.cart ? props.cart.total_items : '0'}
          </p>
        </div>
      </div>
    </header>
  )
}

export default Header;
