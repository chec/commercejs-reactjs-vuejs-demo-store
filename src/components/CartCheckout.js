import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
import { ReactComponent as RemoveIcon } from '../assets/remove-icon.svg';
import { ReactComponent as ArrowIcon } from '../assets/arrow-icon.svg';
import pairShoes from '../assets/pair-shoes-small.png'

class CartCheckout extends Component {

  constructor(props) {
    super(props);
    this.handleFormChanges = this.handleFormChanges.bind(this);
    this.getAllCountries = this.getAllCountries.bind(this);
    this.getRegions = this.getRegions.bind(this);
    this.createCheckout = this.createCheckout.bind(this);
    this.getShippingOptions = this.getShippingOptions.bind(this);
    this.captureOrder = this.captureOrder.bind(this);
    this.removeProductFromCart = this.removeProductFromCart.bind(this);
    this.state = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@doe.com',
      deliveryStreetAddress: '1161 Mission St',
      deliveryCity: 'San Francisco',
      deliveryState: 'CA',
      deliveryZip: "94103",
      deliveryCountry: 'US',
      countries: {},
      subdivisions: {},
      checkout: null,
      // state below is set after checkout token is generated
      shippingOption: '',
      shippingOptions: [],
      shippingOptionsById: {},
      cardNumber: '4242 4242 4242 4242',
      expMonth: '01',
      expYear: '2021',
      cvc: '123',
      billingPostalZipcode: '94103',
    }
  }

  componentDidMount() {
    this.getAllCountries()
    this.getRegions(this.state.deliveryCountry)
  }

  handleFormChanges(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
    if (e.target.name === "deliveryCountry") {
      this.getRegions(e.target.value)
      if (this.state.checkout) {
        this.getShippingOptions(this.state.checkout.id, e.target.value)
      }
    }
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
    if (e) {
      e.preventDefault()
    }
    if (!this.props.cart) {
      return;
    }
    if (this.props.cart.total_items > 0) {
      this.props.commerce.Checkout
        .generateToken(this.props.cart.id, { type: 'cart' },
          (checkout) => {
            this.getShippingOptions(checkout.id, (this.state.deliveryCountry || 'US'))
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

  getShippingOptions(checkoutId, country) {
    this.props.commerce.Checkout.getShippingOptions(checkoutId, { country }, (resp) => {
      if (!resp.error) {
        this.setState({
          shippingOptions: resp,
          shippingOptionsById: resp.reduce((obj, option) => {
           obj[option.id] = option
           return obj
          }, {})
        })
      } else {
        this.setState({
          shippingOptions: [],
          shippingOptionsById: {}
        })
      }
    })
  }

  captureOrder(e) {
    if (e) {
      e.preventDefault()
    }
    const lineItems = this.state.checkout.live.line_items.reduce((obj, lineItem) => {
      obj[lineItem.id] = {
        quantity: lineItem.quantity,
        variants: {
          [lineItem.variants[0].variant_id]: lineItem.variants[0].option_id
        }
      }
      return obj
    }, {})
    const newOrder = {
      line_items: lineItems,
      customer: {
        firstname: this.state.firstName,
        lastname: this.state.lastName,
        email: this.state.email
      },
      shipping: {
        name: `${this.state.firstName} ${this.state.lastName}`,
        country: this.state.deliveryCountry,
        street: this.state.deliveryStreetAddress,
        town_city: this.state.deliveryCity,
        county_state: this.state.deliveryState,
        postal_zip_code: this.state.deliveryZip
      },
      fulfillment: {
        shipping_method: this.state.shippingOption
      },
      payment: {
        gateway: "test_gateway",
        card: {
          number: this.state.cardNumber,
          expiry_month: this.state.expMonth,
          expiry_year: this.state.expYear,
          cvc: this.state.cvc,
          postal_zip_code: this.state.billingPostalZipcode
        }
      }
    }
    console.log('The order constructed', newOrder)
    this.props.captureOrder(this.state.checkout.id, newOrder)
  }

  removeProductFromCart(itemId) {
    this.props.removeProductFromCart(itemId).then(({ cart }) => {
      if (cart.total_items === 0) {
        return this.setState({
          checkout: null
        }, () => alert("Add items to your cart before to continue checkout."))
      }
      this.createCheckout()
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
            onClick={() => this.removeProductFromCart(item.id)}
            className="cartIconContainer dim pointer pa0 bg-none">
            <RemoveIcon />
          </button>
          <div className="w-25">
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
              <span className="ttl">x</span>{item.quantity} - ${item.line_total.formatted_with_code}
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

    const allShippingOptions = this.state.shippingOptions.map((option, key) => {
      return (
        <option value={option.id} key={key}>
          { `${option.description} - $${option.price.formatted_with_code}` }
        </option>
      )
    })

    return (
      <div className="flex flex-grow-1 flex-column bg-tan-white w-100 pb4">
        <div className="flex justify-between mw9 w-100 center mt5 ph4">
          <Link to="/white-shoe" className="flex items-center medium-text f6 tracked-mega ttu no-underline dark-gray dim">
            <div className="arrowIconContainer fill-cherry pr4">
              <ArrowIcon />
            </div>
            continue shopping
          </Link>

          <p class="medium-text f6 tracked-mega ttu dark-gray tracked-mega">
            {this.props.cart ? this.props.cart.total_items : '0'}
            <span className="f7">{this.props.cart ? (this.props.cart.total_items === 1 ? 'item' : 'items') : 'items'}</span>
          </p>
        </div>
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
                  <div className="flex justify-between">
                    <div className="w-50 pr2 flex flex-column">
                      <label>
                        <p className="checkoutFormInputLabel">
                          first name
                        </p>
                      </label>
                      <input
                        className="checkoutFormInput"
                        type="text"
                        name="firstName"
                        value={this.state.firstName}
                        placeholder="first name"
                      />
                    </div>
                    <div className="w-50 pl2 flex flex-column">
                      <label>
                        <p className="checkoutFormInputLabel">
                          first name
                        </p>
                      </label>
                      <input
                        className="checkoutFormInput"
                        type="text"
                        name="lastName"
                        value={this.state.lastName}
                        placeholder="first name"
                      />
                    </div>
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
                      <div className="checkoutFormInput flex-grow-1 relative">
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
                  {
                    this.state.checkout &&
                    (
                    <Fragment>
                      <div className="w-100 flex flex-column mt4">
                        <label>
                          <p className="checkoutFormInputLabel">
                            delivery method
                          </p>
                        </label>
                        <div className="checkoutFormInput flex-grow-1 relative">
                          <p>
                            {
                              this.state.shippingOption ?
                              `${
                                this.state.shippingOptionsById[this.state.shippingOption].description}
                                - $${this.state.shippingOptionsById[this.state.shippingOption].price.formatted_with_code
                                }` :
                              'Select a delivery method'}
                          </p>
                          <select
                            name="shippingOption"
                            onChange={this.handleFormChanges}
                            value={this.state.shippingOption}
                            placeholder="shippingOption"
                            className="absolute absolute--fill left-0 o-0 pointer w-100">
                            <option value="" disabled>Select a delivery method</option>
                            {allShippingOptions}
                          </select>
                        </div>
                      </div>
                      <div
                        className="w-100 flex flex-column">
                        <label>
                          <p className="checkoutFormInputLabel">
                            card number
                          </p>
                        </label>
                        <input
                          className="checkoutFormInput"
                          type="number"
                          name="cardNumber"
                          value={this.state.cardNumber}
                          placeholder="Card Number"
                        />
                      </div>
                      <div className="w-100 flex">
                        <div className="w-third flex flex-column">
                          <label>
                            <p className="checkoutFormInputLabel">
                              expiry month
                            </p>
                          </label>
                          <input
                            className="checkoutFormInput"
                            type="number"
                            name="expMonth"
                            value={this.state.expMonth}
                            placeholder="expiry month"
                          />
                        </div>
                        <div className="w-third flex flex-column ph2">
                          <label>
                            <p className="checkoutFormInputLabel">
                              expiry year
                            </p>
                          </label>
                          <input
                            className="checkoutFormInput"
                            type="number"
                            name="expYear"
                            value={this.state.expYear}
                            placeholder="expiry year (yyyy)"
                          />
                        </div>
                        <div className="w-third flex flex-column ph2">
                          <label>
                            <p className="checkoutFormInputLabel">
                              cvc
                            </p>
                          </label>
                          <input
                            className="checkoutFormInput"
                            type="number"
                            name="cvc"
                            value={this.state.cvc}
                            placeholder="cvc"
                          />
                        </div>
                      </div>
                    </Fragment>
                    )
                  }
                  <div className="flex flex-column">
                    <button
                      onClick={this.state.checkout ? this.captureOrder : this.createCheckout}
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
