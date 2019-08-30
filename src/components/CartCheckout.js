import { Component, h } from 'panel';

// svg
import pairShoes from '../assets/pair-shoes-small.png';
import RemoveIconSvg from '../assets/RemoveIconSvg';
import ArrowIconSvg from '../assets/ArrowIconSvg';

function CartLineItem(props) {
  return h('div', {}, [
    h('div', { attrs: { class: 'flex flex-row justify-between items-center ph4 pv2'}}, [
      h('button', {
        on: {
          click: () => props.removeProductFromCart(props.item.id)
        },
        attrs: {
          class: 'cartIconContainer dim pointer pa0 bg-none'
        }
      },[
        RemoveIconSvg()
      ]),
      h('div', {
        attrs: {
          class: 'w-25'
        }
      }, [
        h('div', {
          style: {
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "contain",
            backgroundImage: `url(${pairShoes})`
          },
          attrs: {
            class: 'aspect-ratio aspect-ratio--1x1'
          }
        })
      ]),
      h('div', { attrs: { class: "medium-text f6 white tr ttu mw4"}}, [
        props.item.name,
        h('span', { attrs: { class: "db f7 pv1"}}, [
          props.item.variants[0] ? props.item.variants[0].option_name : ''
        ]),
        h('span', { attrs: { class: "db f7"}}, [
          props.item.line_total.formatted_with_code
        ]),
        h('span', { attrs: { class: "db"}}, [
          h('div', { attrs: { class: "flex flex-row items-center justify-end"}},[
            h('button', {
              on: { click: () => props.updateQuantity(props.item.id, props.item.quantity - 1) },
              attrs: { class: "bg-none white f4 pointer grow dim ph2"}}, [
              '-'
            ]),
            h('span', { attrs: { class: "ttl"}}, [
              'x'
            ]),
            props.item.quantity,
            h('button', {
              on: { click: () => props.updateQuantity(props.item.id, props.item.quantity + 1) },
              attrs: { class: "bg-none white f5 pointer grow dim ph2"}}, [
              '+'
            ])
          ])
        ])
      ])
    ])
  ])
}

class CartCheckout extends Component {
  constructor() {
    super();
    this._mounted = false;
    this.handleFormChanges = this.handleFormChanges.bind(this)
    this.getAllCountries = this.getAllCountries.bind(this);
    this.getRegions = this.getRegions.bind(this);
    this.createCheckout = this.createCheckout.bind(this);
    this.getShippingOptions = this.getShippingOptions.bind(this);
    this.captureOrder = this.captureOrder.bind(this);
    this.removeProductFromCart = this.removeProductFromCart.bind(this);
    this.updateQuantity = this.updateQuantity.bind(this);
  }

  _init() {
    this._mounted = true;
    this.getAllCountries()
    this.getRegions(this.state.deliveryCountry)
  }

  updateQuantity(lineItemId, quantity) {
    this.$panelRoot.updateQuantity(lineItemId, quantity).then(() => {
      if (this.state.checkout !== null) {
        this.createCheckout()
      }
    })
  }

  handleFormChanges(e) {
    this.update({
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
    console.log("this is it", this.$panelRoot)
    this.$panelRoot.commerce.Services.localeListCountries((resp) => {
      this.update({
        countries: resp.countries
      })
    },
    error => console.log(error)
    )
  }

  getRegions(countryCode) {
    this.$panelRoot.commerce.Services.localeListSubdivisions(countryCode, (resp) => {
      this.update({
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

    if (!this.state.cart) {
      return;
    }

    if (this.state.cart.total_items > 0) {
      this.$panelRoot.commerce.Checkout
        .generateToken(this.state.cart.id, { type: 'cart' },

          (checkout) => {
            this.getShippingOptions(checkout.id, (this.state.deliveryCountry || 'US'))
            this.update({
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

    this.$panelRoot.commerce.Checkout.getShippingOptions(checkoutId, { country }, (resp) => {

      if (!resp.error) {
        this.update({
          shippingOptions: resp,
          shippingOptionsById: resp.reduce((obj, option) => {
           obj[option.id] = option
           return obj
          }, {})
        })
      } else {

        this.update({
          shippingOptions: [],
          shippingOptionsById: {}
        })
      }
    })
  }

  captureOrder(e) {
    this.update({
      errors: {
        "fulfillment[shipping_method]": null,
        gateway_error: null,
        "shipping[name]": null,
        "shipping[street]": null,
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
    this.$panelRoot.captureOrder(this.state.checkout.id, newOrder)
      .catch(({error}) => {

        if (error.type === 'validation') {
          console.log('the error messages:', error.message)

          error.message.forEach(({param, error}, i) => {
            this.update({
              errors: {
                ...this.state.errors,
                [param]: error
              }
            })
          })

          const allErrors = error.message.reduce((string, error) => {
            return `${string} ${error.error}`
          }, '')
          alert(allErrors)
        }

        if (error.type === 'gateway_error') {
          this.update({
            errors: {
              ...this.state.errors,
              [error.type]: error.message
            }
          })
          alert(error.message)
        }

      })
  }

  removeProductFromCart(itemId) {
    this.$panelRoot.removeProductFromCart(itemId).then(({ cart }) => {
      if (cart.total_items === 0) {
        this.update({
          checkout: null
        })
        alert("Add items to your cart before to continue checkout.")
        return;
      }
      this.createCheckout()
    })
  }

  get config() {
    return {
      defaultState: {
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
        }
      },

      hooks: {
        postUpdate: (stateUpdate) => {
          if (!this._mounted) this._init();
        }
      },

      template: props => {
        const {
          line_items: lineItems = []
        } = props.cart || {};

        const allLineItems = lineItems.map((item, key) => {
          return CartLineItem({
            removeProductFromCart: this.removeProductFromCart,
            item: item,
            key: key,
            updateQuantity: this.updateQuantity
          })
        })

        const allCountryOptions = Object.keys(this.state.countries).map((country, key) => {
          return h('option', { key, attrs: { value: country }}, [
            this.state.countries[country]
          ])
        })

        const allSubdivisionsOptions = Object.keys(this.state.subdivisions).map((subdivision, key) => {
          return h('option', { key, attrs: { value: subdivision }}, [
            this.state.subdivisions[subdivision]
          ])
        })

        const allShippingOptions = this.state.shippingOptions.map((option, key) => {
          return h('option', { key, attrs: { value: option.id }}, [
            `${option.description} - $${option.price.formatted_with_code}`
          ])
        })

        return h('div', { attrs: { class: 'flex flex-grow-1 flex-column bg-tan-white w-100 pb4'}}, [
          h('div', { attrs: { class: 'flex justify-between mw9 w-100 items-center center pt4 ph4'}}, [
            h('a', { attrs: { href: '#white-shoe', class: 'flex items-center medium-text f7 f6-ns tracked-mega ttu no-underline dark-gray dim'}}, [
              h('div', { attrs: { class: 'arrowIconContainer fill-cherry pr4'}}, [
                ArrowIconSvg()
              ]),
              'continue shopping'
            ]),
            h('p', { attrs: { class: 'medium-text f6 tracked-mega ttu dark-gray tracked-mega'}}, [
              props.cart ? props.cart.total_items : '0',
              h('span', { attrs: { class: 'f7'}}, [
                props.cart ? (props.cart.total_items === 1 ? 'item' : 'items') : 'items'
              ])
            ])
          ]),
          h('div', { attrs: { class: 'cf mw9 center w-100 ph3 mt5'}}, [
            h('div', { attrs: { class: 'fl w-100 w-40-l ph2 ph4-l mb4'}}, [
              h('div', { attrs: { class: 'relative z-1 h5 br3 bg-dark-gray w-100 shadow-3 pt4 overflow-scroll'}}, [
                ...allLineItems
              ]),
              h('div', { attrs: { class: 'pt4 pb3 nt3 br3 ph4 bg-cherry'}}, [
                h('div', { attrs: { class: 'flex pb1 justify-between items-center w-100 medium-text f6 white ttu b tracked-mega-1 lh-title'}}, [
                  h('p', {}, [
                    'subtotal'
                  ]),
                  h('p', { attrs: { class: 'tr'}}, [
                    props.cart ? props.cart.subtotal.formatted_with_code : '----'
                  ]),
                ])
              ])
            ]),
            h('div', { attrs: { class: 'fl w-100 w-60-l ph2 ph4-l'}}, [
              h('form', { on: { input: this.handleFormChanges }, attrs: { class: 'font-roboto mb4 ttu f6 tracked-mega light-gray'}}, [
                h('div', { attrs: { class: 'flex justify-between'}}, [
                  h('div', { attrs: { class: 'w-50 pr2 flex flex-column'} }, [
                    h('label', {}, [
                      h('p', { attrs: { class: 'checkoutFormInputLabel'}}, [
                        'first name'
                      ])
                    ]),
                    h('input', {
                      attrs: {
                        class: "checkoutFormInput",
                        type: "text",
                        name: "firstName",
                        value: this.state.firstName,
                        placeholder: "first name",
                      }
                    })
                  ]),
                  h('div', { attrs: { class: 'w-50 pr2 flex flex-column'} }, [
                    h('label', {}, [
                      h('p', { attrs: { class: 'checkoutFormInputLabel'}}, [
                        'last name'
                      ])
                    ]),
                    h('input', {
                      attrs: {
                        class: "checkoutFormInput",
                        type: "text",
                        name: "lastName",
                        value: this.state.lastName,
                        placeholder: "first name"
                      }
                    })
                  ]),
                ]),
                h('div', {}, [
                  h('label', {}, [
                    h('p', { attrs: { class: 'checkoutFormInputLabel'}}, [
                      'email'
                    ])
                  ]),
                  h('input', {
                    class: {
                      'input-error': this.state.errors["customer[email]"]
                    },
                    attrs: {
                      class: 'checkoutFormInput',
                      type: 'email',
                      name: 'customer[email]',
                      value: this.state["customer[email]"],
                      placeholder: 'Email Address',
                    }
                  })
                ]),
                h('div', {}, [
                  h('label', {}, [
                    h('p', { attrs: { class: 'checkoutFormInputLabel'}}, [
                      'Delivery Name'
                    ])
                  ]),
                  h('input', {
                    class: { 'input-error': this.state.errors['shipping[name]']},
                    attrs: {
                      class: 'checkoutFormInput',
                      type: "text",
                      name: "shipping[name]",
                      value: this.state["shipping[name]"],
                      placeholder: "Delivery Name",
                    }
                  })
                ]),
                h('div', { attrs: { class: 'flex justify-between'}}, [
                  h('div', { attrs: { class: 'w-70 pr2 flex flex-column'}}, [
                    h('label', {}, [
                      h('p', { attrs: { class: 'checkoutFormInputLabel'}}, [
                        'city'
                      ])
                    ]),
                    h('input', {
                      class: { 'input-error': this.state.errors['shipping[town_city]']},
                      attrs: {
                        class: 'checkoutFormInput',
                        type: 'text',
                        name: 'shipping[town_city]',
                        value: this.state["shipping[town_city]"],
                        placeholder: 'City'
                      }
                    })
                  ]),
                  h('div', { attrs: { class: 'w-30 pl2 flex flex-column'}}, [
                    h('label', {}, [
                      h('p', { attrs: { class: 'checkoutFormInputLabel'}}, [
                        'post/zip code'
                      ])
                    ]),
                    h('input', {
                      class: { 'input-error': this.state.errors['shipping[postal_zip_code]']},
                      attrs: {
                        class: 'checkoutFormInput',
                        type: 'number',
                        name: 'shipping[postal_zip_code]',
                        value: this.state["shipping[postal_zip_code]"],
                        placeholder: 'post/zip code',
                      }
                    })
                  ])
                ]),
                h('div', { attrs: { class: 'flex justify-between'}}, [
                  h('div', { attrs: { class: 'w-50 pr2 flex flex-column'}}, [
                    h('label', {}, [
                      h('p', { attrs: { class: 'checkoutFormInputLabel'}}, [
                        'country'
                      ])
                    ]),
                    h('div', { attrs: { class: 'checkoutFormInput flex-grow-1 relative tc lh-title'}}, [
                      h('p', {}, [
                        this.state.countries[this.state.deliveryCountry] || 'Select your country'
                      ]),
                      h('select', {
                        on: { click: this.handleFormChanges.bind(this) },
                        attrs: {
                          name: "deliveryCountry",
                          value: this.state.deliveryCountry,
                          placeholder: "Delivery",
                          class: "absolute absolute--fill left-0 o-0 pointer w-100"
                        }
                      },[
                        h('option', { attrs: {
                          value:"",
                          disabled: true
                        }}, [
                          'Select your country'
                        ]),
                        ...allCountryOptions,
                      ])
                    ])
                  ]),
                  h('div', { attrs: { class: 'w-50 pl2 flex flex-column relative'}}, [
                    h('label', {}, [
                      h('p', { attrs: { class: ' checkoutFormInputLabel'}}, [
                        'state/province/region'
                      ])
                    ]),
                    h('div', { attrs: { class: 'checkoutFormInput flex-grow-1 relative flex items-center tc'}}, [
                      h('p', {}, [
                        this.state.deliveryCountry ? this.state.subdivisions[this.state.deliveryState] || 'Select your state' : 'Select a country first'
                      ]),
                      h('select', {
                        on: {
                          input: this.handleFormChanges.bind(this)
                        },
                        attrs: {
                          name: "deliveryState",
                          disabled: !!!this.state.deliveryCountry,
                          value: this.state.deliveryState,
                          class: "absolute absolute--fill left-0 o-0 pointer w-100"
                        }
                      }, [
                        h('option', { attrs: { disabled: true, value: ''}}, [
                          'select your state'
                        ]),
                        ...allSubdivisionsOptions
                      ])
                    ])
                  ])
                ]),
                this.state.checkout ? h('div', {}, [
                  h('div', { attrs: { class: 'w-100 flex flex-column mt4' }}, [
                    h('label', {}, [
                      h('p', { attrs: { class: 'checkoutFormInputLabel'}}, [
                        'delivery method'
                      ])
                    ]),
                    h('div', {
                      class: { 'input-error': this.state.errors["fulfillment[shipping_method]"] },
                      attrs: {
                        class: 'checkoutFormInput flex-grow-1 relative'
                      }
                    }, [
                      h('p', {}, [
                        this.state["fulfillment[shipping_method]"] ?
                        `${
                          this.state.shippingOptionsById[this.state["fulfillment[shipping_method]"]].description}
                          - $${this.state.shippingOptionsById[this.state["fulfillment[shipping_method]"]].price.formatted_with_code
                        }` :
                        'Select a delivery method'
                      ]),
                      h('select', {
                        on: {
                          input: this.handleFormChanges.bind(this)
                        },
                        attrs: {
                          name: "fulfillment[shipping_method]",
                          value: this.state["fulfillment[shipping_method]"],
                          placeholder: "Shipping Option",
                          class: "absolute absolute--fill left-0 o-0 pointer w-100"
                        }
                      }, [
                        h('option', { attrs: { value: '', disabled: true}}, [
                          'Select a delivery method'
                        ]),
                        ...allShippingOptions,
                      ])
                    ])
                  ]),
                  h('div', { attrs: { class: 'w-100 flex flex-column'}}, [
                    h('label', {}, [
                      h('p', { attrs: { class: 'checkoutFormInputLabel'}}, [
                        'card number'
                      ])
                    ]),
                    h('input', {
                      class: { 'input-error': this.state.errors.gateway_error },
                      attrs: {
                        class: 'checkoutFormInput',
                        type: "number",
                        name: "cardNumber",
                        value: this.state.cardNumber,
                        placeholder: "Card Number",
                      }
                    })
                  ]),
                  h('div', { attrs: { class: 'w-100 flex'}}, [
                    h('div', { attrs: { class: 'w-third flex flex-column'}}, [
                      h('label', {}, [
                        h('p', { attrs: { class: 'checkoutFormInputLabel'}}, [
                          'expiry month'
                        ])
                      ]),
                      h('input', {
                        attrs: {
                          class: "checkoutFormInput",
                          type: "number",
                          name: "expMonth",
                          value: this.state.expMonth,
                          placeholder: "expiry month"
                        }
                      })
                    ]),
                    h('div', { attrs: { class: 'w-third flex flex-column ph2'}}, [
                      h('label', {}, [
                        h('p', { attrs: { class: 'checkoutFormInputLabel'}}, [
                          'expiry year'
                        ])
                      ]),
                      h('input', {
                        attrs: {
                          class: "checkoutFormInput",
                          type: "number",
                          name: "expYear",
                          value: this.state.expYear,
                          placeholder: "expiry year (yyyy)"
                        }
                      })
                    ]),
                    h('div', { attrs: { class: 'w-third flex flex-column ph2'}}, [
                      h('label', {}, [
                        h('p', { attrs: { class: "checkoutFormInputLabel"}}, [
                          'cvc'
                        ])
                      ]),
                      h('input', {
                        attrs: {
                          class: "checkoutFormInput",
                          type: "number",
                          name: "cvc",
                          value: this.state.cvc,
                          placeholder: "cvc"
                        }
                      })
                    ]),
                  ])
                ]) : '',
                h('div', { attrs: { class: 'flex flex-column'}}, [
                  h('button', {
                    on: {
                      click: this.state.checkout ? this.captureOrder : this.createCheckout
                    },
                    attrs: {
                      class: 'button__checkout bg-dark-gray white ttu b self-end pointer dim shadow-5 tracked-mega-1'
                    }
                  }, [
                    this.state.checkout ? 'complete checkout' : 'checkout'
                  ])
                ]),
              ])
            ])
          ]),
        ])
      }
    }
  }
}



export default CartCheckout;
