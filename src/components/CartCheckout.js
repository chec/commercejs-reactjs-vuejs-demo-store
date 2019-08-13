import React, { Component } from 'react';
import { ReactComponent as RemoveIcon } from '../assets/remove-icon.svg';
import pairShoes from '../assets/pair-shoes-small.png'

class CartCheckout extends Component {

  constructor(props) {
    super(props);
    this.handleFormChanges = this.handleFormChanges.bind(this);
    this.getAllCountries = this.getAllCountries.bind(this);
    this.getRegions = this.getRegions.bind(this);
    this.createCheckout = this.createCheckout.bind(this);
    this.state = {
      fullName: 'John Doe',
      email: 'john@doe.com',
      deliveryStreetAddress: '1161 Mission St',
      deliveryCity: 'San Francisco',
      deliveryState: 'CA',
      deliveryZip: "94103",
      deliveryCountry: 'US',
      countries: {},
      subdivisions: {}
    }
  }

  componentDidMount() {
    this.getAllCountries()
    this.getRegions(this.state.deliveryCountry)
  }

  getAllCountries() {
    this.props.commerce.Services.localeListCountries((resp) => {
      this.setState({
        countries: resp.countries
      })
    },
    error => console.log(error)
    )
  }

  getRegions(countryCode) {
    this.props.commerce.Services.localeListSubdivisions(countryCode, (resp) => {
      this.setState({
        subdivisions: resp.subdivisions
      })
    },
    error => console.log(error)
    )
  }

  // checkout methods
  createCheckout(e) {
    e.preventDefault()
    if (this.props.cart.total_items > 0) {
      this.props.commerce.Checkout
        .generateToken(this.props.cart.id, { type: 'cart' },
          (checkout) => {
            this.setState({
              checkout: checkout
            })
          },
          function(error) {
            console.log('Error:', error)
          })
    } else {
      alert("Your cart is empty")
    }
  }

  handleFormChanges(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
    if (e.target.name === "deliveryCountry") {
      this.getRegions(e.target.value)
    }
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

    const allCountryOptions = Object.keys(this.state.countries).map((country, key) => {
      return (
        <option value={country} key={key}>
          { this.state.countries[country] }
        </option>
      )
    })

    const allSubdivisionsOptions = Object.keys(this.state.subdivisions).map((subdivision, key) => {
      return (
        <option value={subdivision} key={key}>
          { this.state.subdivisions[subdivision] }
        </option>
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
                  <div className="flex pb1 justify-between items-center w-100 medium-text f6 white ttu b tracked-mega-1">
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
              <form onChange={this.handleFormChanges} className="font-roboto mb4 ttu f6 tracked-mega light-gray">
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
                      placeholder="Full Name"
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
                      placeholder="Email Address"
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
                      placeholder="Delivery Street Address"
                    />
                  </div>
                  <div className="flex justify-between">
                    <div className="w-70 pr2 flex flex-column">
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
                        placeholder="City"
                      />
                    </div>
                    <div className="w-30 pl2 flex flex-column">
                      <label>
                        <p className="checkoutFormInputLabel">
                          post/zip code
                        </p>
                      </label>
                      <input
                        className="checkoutFormInput"
                        type="number"
                        name="deliveryZip"
                        value={this.state.deliveryZip}
                        placeholder="post/zip code"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-50 pr2 flex flex-column">
                      <label>
                        <p className="checkoutFormInputLabel">
                          country
                        </p>
                      </label>
                      <div class="checkoutFormInput flex-grow-1 relative">
                        <p>
                          {this.state.countries[this.state.deliveryCountry] || 'Select your country'}
                        </p>
                        <select
                          name="deliveryCountry"
                          onChange={this.handleFormChanges}
                          value={this.state.deliveryCountry}
                          placeholder="Delivery"
                          className="absolute absolute--fill left-0 o-0 pointer w-100">
                          <option value="" disabled>Select your country</option>
                          {allCountryOptions}
                        </select>
                      </div>
                    </div>
                    <div className="w-50 pl2 flex flex-column relative">
                      <label>
                        <p className="checkoutFormInputLabel">
                          state/province/region
                        </p>
                      </label>
                      <div className="checkoutFormInput flex-grow-1 relative">
                        <p>
                          {this.state.deliveryCountry ? this.state.subdivisions[this.state.deliveryState] || 'Select your state' : 'Select a country first'}
                        </p>
                        <select
                          name="deliveryState"
                          disabled={!!!this.state.deliveryCountry}
                          onChange={this.handleFormChanges}
                          value={this.state.deliveryState}
                          className="absolute absolute--fill left-0 o-0 pointer w-100">
                          <option value="" disabled>Select your state</option>
                          {allSubdivisionsOptions}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-column">
                    <button
                      onClick={this.createCheckout}
                      className="button__checkout bg-dark-gray white ttu b self-end pointer dim shadow-5 tracked-mega-1"
                    >
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
