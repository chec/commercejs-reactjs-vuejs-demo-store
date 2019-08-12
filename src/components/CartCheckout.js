import React, { Component } from 'react';
import { ReactComponent as RemoveIcon } from '../assets/remove-icon.svg';
import pairShoes from '../assets/pair-shoes-small.png'

class CartCheckout extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      line_items: lineItems = []
    } = this.props.cart || {};

    const allLineItems = lineItems.map((item, key) => {
      return (
        <div className="flex flex-row justify-between items-center ph4 pv2" key={key}>
          <button
            onClick={() => this.props.removeProductFromCart(item.id)}
            className="cartIconContainer dim pointer pa0 bg-none">
            <RemoveIcon />
          </button>
          <div class="w-25">
            <div
               className="aspect-ratio aspect-ratio--1x1"
               style={{
                 backgroundRepeat: "no-repeat",
                 backgroundPosition: "center",
                 backgroundSize: "contain",
                 backgroundImage: `url(${pairShoes})`
               }}
             />
          </div>
          <p className="medium-text f6 white tr ttu mw4">
            {item.name}
            <span className="db f7 pv1">
              {item.variants[0].option_name}
            </span>
            <span className="db f7">
              x{item.quantity} - ${item.line_total.formatted_with_code}
            </span>
          </p>
        </div>
      )
    })

    return (
      <div className="flex flex-grow-1 bg-tan-white w-100">
        <div className="cf mw9 center w-100 ph3 mt5">
            <div className="fl w-40 ph3">
                <div className="relative z-1 h5 br3 bg-dark-gray w-100 shadow-3 pt2 overflow-scroll">
                  {allLineItems}
                </div>
                <div className="pt4 pb3 nt3 br3 ph4 bg-cherry">
                  <div className="flex justify-between items-center w-100 medium-text f6 white ttu b tracked-mega-1">
                    <p>
                      subtotal
                    </p>
                    <p className="tr">
                      ${this.props.cart ? this.props.cart.subtotal.formatted_with_code : '----'}
                    </p>
                  </div>
                </div>
            </div>
            <div className="fl w-60 ph4">
              <div>
                <form className="font-roboto">
                  <div>
                    <label>
                      <p className="flex ">
                        full name
                      </p>
                    </label>
                    <input className="checkoutFormInput" type="text" name="fullName"/>
                  </div>
                </form>
              </div>
            </div>
        </div>
      </div>
    )
  }
}

export default CartCheckout;
