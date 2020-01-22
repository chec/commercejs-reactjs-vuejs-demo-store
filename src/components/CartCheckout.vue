<template>
  <div v-if="cart && !loading.order" class="flex flex-grow-1 flex-column bg-tan-white w-100 pb4">
    <div class="flex justify-between mw9 w-100 items-center center pt4 ph4">
      <router-link to="/products" class="flex items-center medium-text f6 tracked-mega ttu no-underline dark-gray dim lh-solid">
        <div class="arrowIconContainer fill-cherry pr4">
          <ArrowIconSvg />
        </div>
        continue shopping
      </router-link>

      <p class="medium-text f6 tracked-mega ttu dark-gray tracked-mega lh-solid tr">
        {{ cart ? cart.total_items : '0' }}
        <span class="f7">{{cart ? (cart.total_items === 1 ? 'item' : 'items') : 'items'}}</span>
      </p>
    </div>
    <div class="cf mw9 center w-100 ph3 mt5">
        <div class="fl w-100 w-40-l ph2 ph4-l mb4">
            <div class="relative z-1 br3 bg-dark-gray w-100 shadow-3 pv4 overflow-scroll">
              <CartLineItem
                v-for="item in cart.line_items"
                @remove-product-from-cart="removeProductFromCart"
                :item="item"
                :key="item.id"
                @update-quantity="updateQuantity"
              />
            </div>
            <div class="pt4 pb3 nt3 br3 ph4 bg-cherry">
              <div class="flex pb1 justify-between items-center w-100 medium-text f6 white ttu b tracked-mega-1">
                <p>
                  subtotal
                </p>
                <p class="tr lh-title">
                  {{cart ? cart.subtotal.formatted_with_code : '----'}}
                </p>
              </div>
            </div>
        </div>
        <div class="fl w-100 w-60-l ph2 ph4-l">
          <form class="font-roboto mb4 ttu f6 tracked-mega light-gray">
              <div class="flex justify-between">
                <div class="w-50 pr2 flex flex-column">
                  <label>
                    <p class="checkoutFormInputLabel">
                      first name
                    </p>
                  </label>
                  <input
                    class="checkoutFormInput"
                    type="text"
                    name="firstName"
                    v-model="firstName"
                    placeholder="first name"
                  />
                </div>
                <div class="w-50 pl2 flex flex-column">
                  <label>
                    <p class="checkoutFormInputLabel">
                      first name
                    </p>
                  </label>
                  <input
                    class="checkoutFormInput"
                    type="text"
                    name="lastName"
                    v-model="lastName"
                    placeholder="first name"
                  />
                </div>
              </div>

              <div>
                <label>
                  <p class="checkoutFormInputLabel">
                    email
                  </p>
                </label>
                <input
                  class="checkoutFormInput"
                  :class="[errors['customer[email]'] && 'input-error']"
                  type="email"
                  name="customer[email]"
                  v-model="$data['customer[email]']"
                  placeholder="Email Address"
                />
              </div>
              <div>
                <label>
                  <p class="checkoutFormInputLabel">
                    Delivery Name
                  </p>
                </label>
                <input
                  class="checkoutFormInput"
                  :class="[errors['shipping[name]'] && 'input-error']"
                  type="text"
                  name="shipping[name]"
                  v-model="$data['shipping[name]']"
                  placeholder="Delivery Name"
                />
              </div>
              <div>
                <label>
                  <p class="checkoutFormInputLabel">
                    delivery street address
                  </p>
                </label>
                <input
                  class="checkoutFormInput"
                  :class="[errors['shipping[street]'] && 'input-error']"
                  type="text"
                  name="shipping[street]"
                  v-model="$data['shipping[street]']"
                  placeholder="Delivery Street Address"
                />
              </div>
              <div class="flex justify-between">
                <div class="w-70 pr2 flex flex-column">
                  <label>
                    <p class="checkoutFormInputLabel">
                      city
                    </p>
                  </label>
                  <input
                    class="checkoutFormInput"
                    :class="[errors['shipping[town_city]'] && 'input-error']"
                    type="text"
                    name="shipping[town_city]"
                    v-model="$data['shipping[town_city]']"
                    placeholder="City"
                  />
                </div>
                <div class="w-30 pl2 flex flex-column">
                  <label>
                    <p class="checkoutFormInputLabel">
                      post/zip code
                    </p>
                  </label>
                  <input
                    class="checkoutFormInput"
                    :class="[errors['shipping[postal_zip_code]'] && 'input-error']"
                    type="number"
                    name="shipping[postal_zip_code]"
                    v-model="$data['shipping[postal_zip_code']"
                    placeholder="post/zip code"
                  />
                </div>
              </div>
              <div class="flex justify-between">
                <div class="w-50 pr2 flex flex-column">
                  <label>
                    <p class="checkoutFormInputLabel">
                      country
                    </p>
                  </label>
                  <div class="checkoutFormInput flex-grow-1 relative">
                    <p>
                      {{countries[deliveryCountry] || 'Select your country'}}
                    </p>
                    <select
                      name="deliveryCountry"
                      v-model="deliveryCountry"
                      placeholder="Delivery"
                      class="absolute absolute--fill left-0 o-0 pointer w-100">
                      <option value="" disabled>Select your country</option>
                      <option v-for="(countryValue, countryKey) in countries" :value="countryKey" :key="countryKey">
                        {{ countryValue }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="w-50 pl2 flex flex-column relative">
                  <label>
                    <p class="checkoutFormInputLabel">
                      state/province/region
                    </p>
                  </label>
                  <div class="checkoutFormInput flex-grow-1 relative">
                    <p>
                      {{deliveryCountry ? subdivisions[deliveryState] || 'Select your state' : 'Select a country first'}}
                    </p>
                    <select
                      name="deliveryState"
                      :disabled="!!!deliveryCountry"
                      v-model="deliveryState"
                      class="absolute absolute--fill left-0 o-0 pointer w-100">
                      <option value="" disabled>Select your state</option>
                      <option v-for="(subdivisionValue, subdivisionKey) in subdivisions" :value="subdivisionKey" :key="subdivisionKey">
                        {{ subdivisions[subdivisionKey] }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div v-if="checkout">
                <div class="w-100 flex flex-column mt4">
                  <label>
                    <p class="checkoutFormInputLabel">
                      delivery method
                    </p>
                  </label>
                  <div
                    class="checkoutFormInput flex-grow-1 relative"
                    :class="[errors['fulfillment[shipping_method]'] && 'input-error']">
                    <p>
                      {{
                        $data['fulfillment[shipping_method]'] ?
                        `${
                          shippingOptionsById[this["fulfillment[shipping_method]"]].description}
                          - $${shippingOptionsById[this["fulfillment[shipping_method]"]].price.formatted_with_code
                        }` :
                        'Select a delivery method'
                      }}
                    </p>
                    <select
                      name="fulfillment[shipping_method]"
                      v-model="$data['fulfillment[shipping_method]']"
                      placeholder="Shipping Option"
                      class="absolute absolute--fill left-0 o-0 pointer w-100">
                      <option value="" disabled>Select a delivery method</option>
                      <option v-for="option in shippingOptions" :value="option.id" :key="option.id">
                        {{ `${option.description} - $${option.price.formatted_with_code}` }}
                      </option>
                    </select>
                  </div>
                </div>
                <div
                  class="w-100 flex flex-column">
                  <label>
                    <p class="checkoutFormInputLabel">
                      card number
                    </p>
                  </label>
                  <input
                    class="checkoutFormInput"
                    :class="[errors.gateway_error && 'input-error']"
                    type="number"
                    name="cardNumber"
                    v-model="cardNumber"
                    placeholder="Card Number"
                  />
                </div>
                <div class="w-100 flex">
                  <div class="w-third flex flex-column">
                    <label>
                      <p class="checkoutFormInputLabel">
                        expiry month
                      </p>
                    </label>
                    <input
                      class="checkoutFormInput"
                      type="number"
                      name="expMonth"
                      v-model="expMonth"
                      placeholder="expiry month"
                    />
                  </div>
                  <div class="w-third flex flex-column ph2">
                    <label>
                      <p class="checkoutFormInputLabel">
                        expiry year
                      </p>
                    </label>
                    <input
                      class="checkoutFormInput"
                      type="number"
                      name="expYear"
                      v-model="expYear"
                      placeholder="expiry year (yyyy)"
                    />
                  </div>
                  <div class="w-third flex flex-column ph2">
                    <label>
                      <p class="checkoutFormInputLabel">
                        cvc
                      </p>
                    </label>
                    <input
                      class="checkoutFormInput"
                      type="number"
                      name="cvc"
                      v-model="cvc"
                      placeholder="cvc"
                    />
                  </div>
                </div>
              </div>
              <div class="flex flex-column">
                <button
                  @click.prevent="() => checkout ? captureOrder() : createCheckout()"
                  class="button__checkout bg-cherry white ttu b self-end pointer dim shadow-5 tracked-mega-1"
                >
                  {{`${checkout ? 'buy now' : 'delivery & payment'}`}}
                </button>
              </div>
            </form>
        </div>
    </div>
  </div>
  <FootPrintsLoading v-else>
    {{loading.order ? 'Processing your order...' : 'Loading...'}}
  </FootPrintsLoading>
</template>
<script>
import ArrowIconSvg from '../assets/arrow-icon.svg'
import CartLineItem from './CartLineItem'
import FootPrintsLoading from './FootPrintsLoading';

export default {
  name: 'CartCheckout',
  props: ["cart", "commerce"],
  components: {
    ArrowIconSvg,
    CartLineItem,
    FootPrintsLoading
  },
  data() {
    return {
      firstName: 'John',
      lastName: 'Doe',
      "customer[email]": 'john@doe.com',
      "shipping[name]": 'John Doe',
      "shipping[street]": '1161 Mission St',
      "shipping[town_city]": 'San Francisco',
      deliveryState: 'CA',
      "shipping[postal_zip_code]": "94103",
      deliveryCountry: 'US', // selected country example: this.countries[this.deliveryCountry]
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
      },

      loadingScreenMinLifetime: 4000, // ms lifetime for loading screen
      capturingOrderLoadingScreenMinLifetime: 4000,
    }
  },
  watch: {
    cart(newCart, oldCart) {
      if (newCart !== oldCart) {
        // since this is a hyrbid component showcasing the cart and checkout simultanously
        // we want to watch for this.cart updates, and do work such as
        // reseting the checkout state when there are no longer any cart items
        // Also if there was a checkout token object initiated prior to the change
        // then we also want to get an updated checkout token object
        // from Chec via this.createCheckout for the latest cart
        if (newCart.total_items === 0) { // cart changed the
          this.checkout = null // clear checkout token object if cart empty now
          alert("You must add items to your cart to contiue checkout")
          return;
        }
        // only invoke createCheckout if this.checkout was initiated prior to this update to get an updated checkout token object
        if (this.checkout) {
          this.createCheckout()
        }
      }
    },
    deliveryCountry(newVal) { // do something when new delivery country is selected
      // update the regions/provinces/states that are based on the selected country (this.deliveryCountry)
      this.getRegions(newVal)

      if (this.checkout) { // if there was a checkout initiated prior to this update we want to update
        // the shipping options based on the selected country
        this.getShippingOptions(this.checkout.id, newVal)
      }
    }
  },
  created() {
    this.getAllCountries()
    this.getRegions(this.deliveryCountry)
  },
  methods: {
    // update respective line-item's quantity using commerce.cart.update
    // cart.update can also be used to update variant
    // https://commercejs.com/docs/api/#update-item-in-cart
    updateQuantity(lineItemId, quantity) {
      this.$commerce.cart.update(lineItemId, { quantity })
        .then(resp => {
          this.$emit('update:cart', resp.cart)
        }).catch((error) => {
          // eslint-disable-next-line no-console
          console.log('Error when updating quanttiy', error);
        })
    },
    getAllCountries() {
      this.$commerce.services.localeListCountries().then(resp => {
        this.countries = resp.countries
      }).catch(error => {
        // eslint-disable-next-line no-console
        console.log(error)
      })
    },
    removeProductFromCart(itemId) {
      this.$emit('remove-product-from-cart', itemId)
    },
    captureOrder() {
      let exceededMinLifetime = false;
      let secondsPassed = 0;

      const lifetimeTimeout = setTimeout(() => {
        exceededMinLifetime = true
      }, this.capturingOrderLoadingScreenMinLifetime);

      const secondsInterval = setInterval(() => {
        secondsPassed = secondsPassed + 1000;
      }, 1000)

      this.errors = {
          "fulfillment[shipping_method]": null,
          gateway_error: null,
          "shipping[name]": null,
          "shipping[street]": null,
        };

      this.loading = {
          ...this.loading,
          order: true,
        }

      const lineItems = this.checkout.live.line_items.reduce((obj, lineItem) => {
        obj[lineItem.id] = {
          quantity: lineItem.quantity,
          variants: (!lineItem.variants || {}) || {
            [lineItem.variants[0].variant_id]: lineItem.variants[0].option_id
          }
        }
        return obj
      }, {})
      const newOrder = {
        line_items: lineItems,
        customer: {
          firstname: this.firstName,
          lastname: this.lastName,
          email: this["customer[email]"]
        },
        shipping: {
          name: this["shipping[name]"],
          country: this.deliveryCountry,
          street: this["shipping[street]"],
          town_city: this["shipping[town_city]"],
          county_state: this.deliveryState,
          postal_zip_code: this["shipping[postal_zip_code]"]
        },
        fulfillment: {
          shipping_method: this["fulfillment[shipping_method]"]
        },
        payment: {
          gateway: "test_gateway",
          card: {
            number: this.cardNumber,
            expiry_month: this.expMonth,
            expiry_year: this.expYear,
            cvc: this.cvc,
            postal_zip_code: this.billingPostalZipcode
          }
        }
      }
      // eslint-disable-next-line no-console
      console.log('The order constructed:', newOrder)
      this.$commerce.checkout.capture(this.checkout.id, newOrder)
        .then(resp => {
          this.$emit('refresh-cart')
          this.$emit('update:order', resp)
          this.checkout = null
          return resp;
      })
      .then(() => {
        if (exceededMinLifetime) {
          this.loading = {
            ...this.loading,
            order: false
          }
          this.$router.replace("/thank-you") // redirect now since capturingOrderLoadingScreenMinLifetime satisfied
        } else {
          clearInterval(secondsInterval);
          clearTimeout(lifetimeTimeout)
          const remainingSecondsToWait = this.capturingOrderLoadingScreenMinLifetime - secondsPassed;
          setTimeout(() => {
            this.loading = {
              ...this.loading,
              order: false
            }
            this.$router.replace("/thank-you") // redirect after waiting remainingSecondsToWait
          }, remainingSecondsToWait)
        }
      })
      .catch(({ data }) => {
        const { error = {} } = data
        if (error.type === 'validation') { // catch validation errors and update corresponding data/state
          error.message.forEach(({param, error}) => {
            this.errors = {
              ...this.errors,
              [param]: error
            }
          })
        }

        if (error.type === 'gateway_error' || error.type === 'not_valid' || error.type === 'bad_request') { // either a gateway error or a shipping error and update corresponding data/state
          this.errors = {
            ...this.errors,
            [(error.type === 'not_valid' ? 'fulfillment[shipping_method]' : error.type)]: error.message
          }
        }

        if (exceededMinLifetime) { // after handling errors update loading UI
          this.loading = {
            ...this.loading,
            order: false
          }

        } else {
          clearInterval(secondsInterval);
          clearTimeout(lifetimeTimeout)
          const remainingSecondsToWait = this.capturingOrderLoadingScreenMinLifetime - secondsPassed;
          setTimeout(() => {
            this.loading = {
              ...this.loading,
              order: false
            }
          }, remainingSecondsToWait)
        }
      })
    },
    getRegions(countryCode) {
      this.$commerce.services.localeListSubdivisions(countryCode)
        .then(resp => {
          this.subdivisions = resp.subdivisions
        }).catch(error => {
          // eslint-disable-next-line no-console
          console.log(error)
        })
    },
    // generate checkout token, receive checkout object
    createCheckout() {
      if (!this.cart) {
        return;
      }

      if (this.cart.total_items > 0) {
        this.$commerce.checkout.generateToken(this.cart.id, { type: 'cart' }).then(
          (checkout) => {
            this.getShippingOptions(checkout.id, (this.deliveryCountry || 'US'))
            this.checkout = checkout
          }).catch(error => {
            // eslint-disable-next-line no-console
            console.log('Error:', error)
          })
      } else {
        alert("Your cart is empty")
      }
    },
    getShippingOptions(checkoutId, country) {
      this.$commerce.checkout.getShippingOptions(checkoutId, { country })
        .then(resp => {
          this.shippingOptions = resp
          this.shippingOptionsById = resp.reduce((obj, option) => {
           obj[option.id] = option
           return obj
          }, {})
        }).catch(error => {
          this.shippingOptions = []
          this.shippingOptionsById = {}
          // eslint-disable-next-line no-console
          console.log('Error in getShippingOptions', error)
        })
    }

  }
}
</script>
