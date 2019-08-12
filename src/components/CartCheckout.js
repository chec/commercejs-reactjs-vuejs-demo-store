import React, { Component } from 'react';
import { ReactComponent as RemoveIcon } from '../assets/remove-icon.svg';
import pairShoes from '../assets/pair-shoes-small.png'

class CartCheckout extends Component {

  constructor(props) {
    super(props);
    this.handleFormChanges = this.handleFormChanges.bind(this);
    this.state = {
      fullName: '',
      email: '',
      deliveryStreetAddress: '',
      deliveryCity: ''
    }
  }

  handleFormChanges(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
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
              <span class="ttl">x</span>{item.quantity} - ${item.line_total.formatted_with_code}
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
              <form onChange={this.handleFormChanges} className="font-roboto mb4">
                  <div>
                    <label>
                      <p className="checkoutFormInputLabel">
                        full name
                      </p>
                    </label>
                    <input
                      className="checkoutFormInput"
                      type="text"
                      name="fullName"
                      value={this.state.fullName}
                    />
                  </div>
                  <div>
                    <label>
                      <p className="checkoutFormInputLabel">
                        email
                      </p>
                    </label>
                    <input
                      className="checkoutFormInput"
                      type="email"
                      name="email"
                      value={this.state.email}
                    />
                  </div>
                  <div>
                    <label>
                      <p className="checkoutFormInputLabel">
                        delivery street address
                      </p>
                    </label>
                    <input
                      className="checkoutFormInput"
                      type="text"
                      name="deliveryStreetAddress"
                      value={this.state.deliveryStreetAddress}
                    />
                  </div>
                  <div>
                    <label>
                      <p className="checkoutFormInputLabel">
                        city
                      </p>
                    </label>
                    <input
                      className="checkoutFormInput"
                      type="text"
                      name="deliveryCity"
                      value={this.state.deliveryCity}
                    />
                  </div>
                  <div className="flex justify-between">
                    <div class="w-50 pr2 flex flex-column">
                      <label>
                        <p className="checkoutFormInputLabel">
                          country
                        </p>
                      </label>
                      <input
                        className="checkoutFormInput"
                        type="text"
                        name="deliveryCountry"
                        value={this.state.deliveryCountry}
                      />
                    </div>
                    <div class="w-50 pl2 flex flex-column">
                      <label>
                        <p className="checkoutFormInputLabel">
                          state
                        </p>
                      </label>
                      <div className="checkoutFormInput flex-grow-1">
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-column">
                    <button className="button__checkout bg-dark-gray white ttu b self-end pointer dim shadow-2 tracked-mega-1">
                      checkout
                    </button>
                  </div>
                </form>
            </div>
        </div>
      </div>
    )
  }
}

export default CartCheckout;
