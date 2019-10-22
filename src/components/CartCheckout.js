import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
import { FootPrintsLoading as Loading } from './Loaders';

// util libs
import ccFormat from '../utils/ccFormat';

// assets
import { ReactComponent as RemoveIcon } from '../assets/remove-icon.svg';
import { ReactComponent as ArrowIcon } from '../assets/arrow-icon.svg';
import pairShoes from '../assets/pair-shoes-small.png'
import sockImage from '../assets/updated-sock-image.png'


function CartLineItem(props) {
  return (
    <div className="">
      <div className="flex flex-row justify-between items-center ph4 pv2">
        <button
          onClick={() => props.removeProductFromCart(props.item.id)}
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
               backgroundImage: `url(${props.item.name.trim('').toLowerCase() === 'pink sock' ? sockImage : pairShoes})`
             }}
           />
        </div>
        <div className="medium-text f6 white tr ttu mw4">
          {props.item.name}
          <span className="db f7 pv1">
            {props.item.variants[0] && props.item.variants[0].option_name}
          </span>
          <span className="db f7">
            ${props.item.line_total.formatted_with_code}
          </span>
          <span className="db">
            <div className="flex flex-row items-center justify-end">
              <button className="bg-none white f4 pointer grow dim ph2 cherry" onClick={() => props.updateQuantity(props.item.id, props.item.quantity - 1)}>-</button>
              <span className="ttl">x</span>{props.item.quantity}
              <button className="bg-none white f5 pointer grow dim ph2 cherry" onClick={() => props.updateQuantity(props.item.id, props.item.quantity + 1)}>+</button>
            </div>
          </span>
        </div>
      </div>
    </div>
  )
}


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
    this.updateQuantity = this.updateQuantity.bind(this);
    this.loadingScreenMinLifetime = 4000; // ms lifetime for loading screen
    this.capturingOrderLoadingScreenMinLifetime = 4000;
    this.state = {
      firstName: 'John',
      lastName: 'Doe',
      "customer[email]": 'john@doe.com',
      "shipping[name]": 'John Doe',
      "shipping[street]": '1161 Mission St',
      "shipping[town_city]": 'San Francisco',
      deliveryState: 'CA',
      "shipping[postal_zip_code]": "94103",
      deliveryCountry: 'US',
      countries: {},
      subdivisions: {},
      checkout: null,
      // state below is set after checkout token is generated
      "fulfillment[shipping_method]": '',
      shippingOptions: [],
      shippingOptionsById: {},
      cardNumber: '',
      expMonth: '01',
      expYear: '2021',
      cvc: '123',
      billingPostalZipcode: '94103',

      errors: {
        "fulfillment[shipping_method]": null,
        gateway_error: null,
        "customer[email]": null,
        "shipping[name]": null,
        "shipping[street]": null,
        "shipping[town_city]": null,
        "shipping[postal_zip_code]": null
      },

      loading: {
        checkout: false,
        order: false
      }
    }
  }

  componentDidMount() {
    this.getAllCountries()
    this.getRegions(this.state.deliveryCountry)
  }

  handleFormChanges(e) {
    let value = e.target.value;

    if (e.target.name === "cardNumber") {
      value = ccFormat(value)
    }

    this.setState({
      [e.target.name]: value
    })

    if (e.target.name === "deliveryCountry") {
      this.getRegions(e.target.value)

      if (this.state.checkout) {
        this.getShippingOptions(this.state.checkout.id, e.target.value)
      }
    }
  }

  getAllCountries() {

    this.props.commerce.services.localeListCountries().then(resp => {
      this.setState({
        countries: resp.countries
      })
    }).catch(
    error => console.log(error)
    )
  }

  getRegions(countryCode) {

    this.props.commerce.services.localeListSubdivisions(countryCode).then(resp => {
      this.setState({
        subdivisions: resp.subdivisions
      })
    }).catch(
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
      this.props.commerce.checkout.generateToken(this.props.cart.id, { type: 'cart' }).then(
        (checkout) => {
          this.getShippingOptions(checkout.id, (this.state.deliveryCountry || 'US'))
          this.setState({
            checkout: checkout
          })
        }).catch(
        (error) => {
          console.log('Error:', error)
        })
    } else {
      alert("Your cart is empty")
    }
  }

  getShippingOptions(checkoutId, country) {
    this.props.commerce.checkout.getShippingOptions(checkoutId, { country }).then(resp => {
      const resValues = Object.values(resp)
        this.setState({
          shippingOptions: resValues,
          shippingOptionsById: resValues.reduce((obj, option) => {
           obj[option.id] = option
           return obj
          }, {})
        })
      }).catch(error =>
        this.setState({
          shippingOptions: [],
          shippingOptionsById: {}
        })
      )
  }

  captureOrder(e) {
    let exceededMinLifetime = false;
    let secondsPassed = 0;

    const lifetimeTimeout = setTimeout(() => {
      exceededMinLifetime = true
    }, this.capturingOrderLoadingScreenMinLifetime);

    const secondsInterval = setInterval(() => {
      secondsPassed = secondsPassed + 1000;
    }, 1000)

    this.setState({
      errors: {
        "fulfillment[shipping_method]": null,
        gateway_error: null,
        "shipping[name]": null,
        "shipping[street]": null,
      },
      loading: {
        ...this.state.loading,
        order: true,
      }
    })

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
        email: this.state["customer[email]"]
      },
      shipping: {
        name: this.state["shipping[name]"],
        country: this.state.deliveryCountry,
        street: this.state["shipping[street]"],
        town_city: this.state["shipping[town_city]"],
        county_state: this.state.deliveryState,
        postal_zip_code: this.state["shipping[postal_zip_code]"]
      },
      fulfillment: {
        shipping_method: this.state["fulfillment[shipping_method]"]
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
    console.log('The order constructed:', newOrder)
    this.props.captureOrder(this.state.checkout.id, newOrder)
      .then(() => {
        if (exceededMinLifetime) {
          this.setState({
            loading: {
              ...this.state.loading,
              order: false,
            }
          })
          this.props.history.replace("/thank-you") // redirect now since capturingOrderLoadingScreenMinLifetime satisfied
        } else {
          clearInterval(secondsInterval);
          clearTimeout(lifetimeTimeout)
          const remainingSecondsToWait = this.capturingOrderLoadingScreenMinLifetime - secondsPassed;
          setTimeout(() => {
            this.setState({
              loading: {
                ...this.state.loading,
                order: false,
              }
            })
            this.props.history.replace("/thank-you") // redirect after waiting remainingSecondsToWait
          }, remainingSecondsToWait)
        }
      })
      .catch(({error}) => {
        let errorToAlert = '';
        if (error.type === 'validation') {
          console.log('the error messages:', error.message)

          error.message.forEach(({param, error}, i) => {
            this.setState({
              errors: {
                ...this.state.errors,
                [param]: error
              }
            })
          })

          const allErrors = error.message.reduce((string, error) => {
            return `${string} ${error.error}`
          }, '')
          errorToAlert = allErrors;
        }

        if (error.type === 'gateway_error' || error.type === 'not_valid') {
          this.setState({
            errors: {
              ...this.state.errors,
              [error.type]: error.message
            }
          })
          errorToAlert = error.message
        }

        if (exceededMinLifetime) {
          this.setState({
            loading: {
              ...this.state.loading,
              order: false,
            },
          }, alert(errorToAlert))

        } else {
          clearInterval(secondsInterval);
          clearTimeout(lifetimeTimeout)
          const remainingSecondsToWait = this.capturingOrderLoadingScreenMinLifetime - secondsPassed;
          setTimeout(() => {
            this.setState({
              loading: {
                ...this.state.loading,
                order: false,
              }
            }, alert(errorToAlert))
          }, remainingSecondsToWait)
        }
      })
  }

  removeProductFromCart(itemId) {
    this.props.removeProductFromCart(itemId).then(({ cart }) => {
      if (cart.total_items === 0 && this.state.checkout) {
        return this.setState({
          checkout: null
        }, () => alert("Add items to your cart before to continue checkout."))
      }
      if (this.state.checkout) {
        this.createCheckout()
      }
    })
  }

  updateQuantity(lineItemId, quantity) {
    this.props.updateQuantity(lineItemId, quantity).then(() => {
      if (this.state.checkout !== null) {
        this.createCheckout()
      }
    })
  }


  render() {
    const {
      line_items: lineItems = []
    } = this.props.cart || {};

    const {
      loading
    } = this.state;

    const allLineItems = lineItems.map((item, key) => {
      return (
        <CartLineItem
          removeProductFromCart={this.removeProductFromCart}
          item={item}
          key={key}
          updateQuantity={this.updateQuantity}
        />
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
      <Fragment>
        {
          (loading.order) && (
            <Loading>
              processing order...
            </Loading>
          )
        }
        <div className="flex flex-grow-1 flex-column bg-tan-white w-100 pb4">
        <div className="flex justify-between mw9 w-100 items-center center pt4 ph4 z-1">
          <Link to="/products" className="flex items-center medium-text f7 f6-ns tracked-mega ttu no-underline dark-gray dim">
            <div className="arrowIconContainer fill-cherry pr4">
              <ArrowIcon />
            </div>
            continue shopping
          </Link>

          <p className="medium-text f6 tracked-mega ttu dark-gray tracked-mega">
            {this.props.cart ? this.props.cart.total_items : '0'}
            <span className="f7">{this.props.cart ? (this.props.cart.total_items === 1 ? 'item' : 'items') : 'items'}</span>
          </p>
        </div>
        <div className="cf mw9 center w-100 ph3 mt5">
            <div className="fl w-100 w-40-l ph2 ph4-l mb4">
                <div className="relative z-1 h5 br3 bg-dark-gray w-100 shadow-3 pt4 overflow-scroll">
                  {allLineItems}
                </div>
                <div className="pt4 pb3 nt3 br3 ph4 bg-cherry">
                  <div className="flex pb1 justify-between items-center w-100 medium-text f6 white ttu b tracked-mega-1 lh-title">
                    <p>
                      subtotal
                    </p>
                    <p className="tr">
                      ${this.props.cart ? this.props.cart.subtotal.formatted_with_code : '----'}
                    </p>
                  </div>
                </div>
            </div>
            <div className="fl w-100 w-60-l ph2 ph4-l">
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
                          last name
                        </p>
                      </label>
                      <input
                        className="checkoutFormInput"
                        type="text"
                        name="lastName"
                        value={this.state.lastName}
                        placeholder="last name"
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
                      className={`checkoutFormInput ${this.state.errors["customer[email]"] && 'input-error'}`}
                      type="email"
                      name="customer[email]"
                      value={this.state["customer[email]"]}
                      placeholder="Email Address"
                    />
                  </div>
                  <div>
                    <label>
                      <p className="checkoutFormInputLabel">
                        Delivery Name
                      </p>
                    </label>
                    <input
                      className={`checkoutFormInput ${this.state.errors["shipping[name]"] && 'input-error'}`}
                      type="text"
                      name="shipping[name]"
                      value={this.state["shipping[name]"]}
                      placeholder="Delivery Name"
                    />
                  </div>
                  <div>
                    <label>
                      <p className="checkoutFormInputLabel">
                        delivery street address
                      </p>
                    </label>
                    <input
                      className={`checkoutFormInput ${this.state.errors["shipping[street]"] && 'input-error'}`}
                      type="text"
                      name="shipping[street]"
                      value={this.state["shipping[street]"]}
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
                        className={`checkoutFormInput ${this.state.errors["shipping[town_city]"] && 'input-error'}`}
                        type="text"
                        name="shipping[town_city]"
                        value={this.state["shipping[town_city]"]}
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
                        className={`checkoutFormInput ${this.state.errors["shipping[postal_zip_code]"] && 'input-error'}`}
                        type="number"
                        name="shipping[postal_zip_code]"
                        value={this.state["shipping[postal_zip_code]"]}
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
                      <div className="checkoutFormInput flex-grow-1 relative tc lh-title">
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
                      <div className="checkoutFormInput flex-grow-1 relative flex items-center tc">
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
                        <div className={`checkoutFormInput flex-grow-1 relative ${this.state.errors["fulfillment[shipping_method]"] && 'input-error'}`}>
                          <p>
                            {
                              this.state["fulfillment[shipping_method]"] ?
                              `${
                                this.state.shippingOptionsById[this.state["fulfillment[shipping_method]"]].description}
                                - $${this.state.shippingOptionsById[this.state["fulfillment[shipping_method]"]].price.formatted_with_code
                              }` :
                              'Select a delivery method'}
                          </p>
                          <select
                            name="fulfillment[shipping_method]"
                            onChange={this.handleFormChanges}
                            value={this.state["fulfillment[shipping_method]"]}
                            placeholder="Shipping Option"
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
                          className={`checkoutFormInput ${this.state.errors.gateway_error && 'input-error'}`}
                          type="text"
                          name="cardNumber"
                          pattern="[0-9.]+"
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
                      className="button__checkout bg-cherry white ttu b self-end pointer dim shadow-5 tracked-mega-1"
                    >
                      {`${this.state.checkout ? 'buy now' : 'delivery & payment'}`}
                    </button>
                  </div>

                </form>
            </div>
        </div>
      </div>
      </Fragment>
    )
  }
}

export default CartCheckout;
