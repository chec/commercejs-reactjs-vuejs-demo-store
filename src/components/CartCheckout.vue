<template>
  <div>
    <div v-if="cart" class="flex flex-grow-1 flex-column bg-tan-white w-100 pb4">
      <div class="flex justify-between mw9 w-100 items-center center pt4 ph4">
        <router-link to="/white-shoe" class="flex items-center medium-text f6 tracked-mega ttu no-underline dark-gray dim">
          <div class="arrowIconContainer fill-cherry pr4">
            <ArrowIconSvg />
          </div>
          continue shopping
        </router-link>

        <p class="medium-text f6 tracked-mega ttu dark-gray tracked-mega">
          {{ cart ? cart.total_items : '0' }}
          <span class="f7">{{cart ? (cart.total_items === 1 ? 'item' : 'items') : 'items'}}</span>
        </p>
      </div>
      <div class="cf mw9 center w-100 ph3 mt5">
          <div class="fl w-100 w-40-l ph2 ph4-l mb4">
              <div class="relative z-1 h5 br3 bg-dark-gray w-100 shadow-3 pt2 overflow-scroll">
                <CartLineItem
                  v-for="item in cart.line_items"
                  @remove-product-from-cart="removeProductFromCart"
                  :item="item"
                  @update-quantity="updateQuantity"
                />
              </div>
              <div class="pt4 pb3 nt3 br3 ph4 bg-cherry">
                <div class="flex pb1 justify-between items-center w-100 medium-text f6 white ttu b tracked-mega-1">
                  <p>
                    subtotal
                  </p>
                  <p class="tr">
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
                    v-model="this['customer[email]']"
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
                    v-model="this['shipping[name]']"
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
                    v-model="this['shipping[street]']"
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
                      v-model="this['shipping[town_city]']"
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
                      v-model="this['shipping[postal_zip_code']"
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
                        <option v-for="(countryValue, countryKey) in countries" :value="countryKey">
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
                        <option v-for="(subdivisionValue, subdivisionKey) in subdivisions" :value="subdivisionKey">
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
                          this['fulfillment[shipping_method]'] ?
                          `${
                            shippingOptionsById[this["fulfillment[shipping_method]"]].description}
                            - $${shippingOptionsById[this["fulfillment[shipping_method]"]].price.formatted_with_code
                          }` :
                          'Select a delivery method'
                        }}
                      </p>
                      <select
                        name="fulfillment[shipping_method]"
                        v-model="this['fulfillment[shipping_method]']"
                        placeholder="Shipping Option"
                        class="absolute absolute--fill left-0 o-0 pointer w-100">
                        <option value="" disabled>Select a delivery method</option>
                        <option v-for="option in shippingOptions" :value="option.id">
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
                    @click="(checkout ? captureOrder : createCheckout)"
                    class="button__checkout bg-dark-gray white ttu b self-end pointer dim shadow-5 tracked-mega-1"
                  >
                    {{`${checkout ? 'complete checkout' : 'checkout'}`}}
                  </button>
                </div>
              </form>
          </div>
      </div>
    </div>
    <p v-else>Loading</p>
  </div>
</template>
<script>
import ArrowIconSvg from '../assets/arrow-icon.svg'
import CartLineItem from './CartLineItem'

export default {
  name: 'CartCheckout',
  props: ["cart", "commerce"],
  components: {
    ArrowIconSvg,
    CartLineItem
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
    }
  },
  methods: {
    updateQuantity() {

    }
  }
}
</script>
