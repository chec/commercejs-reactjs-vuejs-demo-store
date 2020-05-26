<template>
  <div v-if="cart" class="flex flex-grow-1 flex-column bg-tan-white w-100 pb4">
    <FootPrintsLoading v-if="loading.order">
      {{loading.order ? 'Processing your order...' : 'Loading...'}}
    </FootPrintsLoading>
    <a class="fixed tc bottom-0 pointer bg-green o-90 z-4 white font-roboto ttu tracked medium-text left-0 w-100 pv2 ph2" :class="[useCommerceComponent ? 'o-50' : '']">
      This checkout form is using a Chec payment-form component, view it on Github here.
    </a>

    <header class="flex justify-between mw9 w-100 items-center center pt4 ph4">
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
    </header>

    <div class="cf mw9 center w-100 ph3 mt5">

      <!-- line items & total -->
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

      <!-- form right -->
      <div class="fl w-100 w-60-l ph2 ph4-l">
        <ChecPaymentForm 
          class="font-roboto mb4 ttu f6 tracked-mega light-gray" 
          :identifierId="cart.id"
          :checkout.sync="checkout"
          :context.sync="formData"
          v-slot="{ countries, subdivisions, shippingOptions, shippingOptionsById, captureOrder }"
          useTestGateway
        >
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
                name="customer.firstName"
                v-model="formData.customer.firstName"
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
                name="customer.lastName"
                v-model="formData.customer.lastName"
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
              name="customer.email"
              v-model="formData.customer.email"
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
              name="shipping.name"
              v-model="formData.shipping.name"
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
              v-model="formData.shipping.street"
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
                name="shipping.townCity"
                v-model="formData.shipping.townCity"
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
                name="shipping.postalZipCode"
                v-model="formData.shipping.postalZipCode"
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
                  {{countries[formData.shipping.country] || 'Select your country'}}
                </p>
                <select
                  name="shipping.country"
                  v-model="formData.shipping.country"
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
                  {{formData.shipping.country ? subdivisions[formData.shipping.countyState] || 'Select your state' : 'Select a country first'}}
                </p>
                <select
                  name="shipping.countyState"
                  v-model="formData.shipping.countyState"
                  class="absolute absolute--fill left-0 o-0 pointer w-100">
                  <option value="" disabled selected>Select your state</option>
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
                    formData.selectedShippingMethod ?
                    `${shippingOptionsById[formData.selectedShippingMethod].description} 
                    - $${shippingOptionsById[formData.selectedShippingMethod].price.formatted_with_code}` :
                    'Select a delivery method'
                  }}
                </p>
                <select
                  name="selectedShippingMethod"
                  v-model="formData.selectedShippingMethod"
                  class="absolute absolute--fill left-0 o-0 pointer w-100">
                  <option value="" disabled selected>Select a delivery method</option>
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
                name="card.number"
                v-model="formData.card.number"
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
                  name="card.expMonth"
                  v-model="formData.card.expMonth"
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
                  name="card.expYear"
                  v-model="formData.card.expYear"
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
                  name="card.cvc"
                  v-model="formData.card.cvc"
                  placeholder="cvc"
                />
              </div>
            </div>
          </div>
          <div class="flex flex-column">
            <button
              @click.prevent="() => handleFormSubmit(captureOrder)"
              class="button__checkout bg-cherry white ttu b self-end pointer dim shadow-5 tracked-mega-1"
            >
              buy now
            </button>
          </div>
        </ChecPaymentForm>
      </div>
    </div>
  </div>
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
    FootPrintsLoading,
  },
  data() {
    return {
      checkout: null, // checkout object

      formData: {}, // formData automatically scafolded and sync. with chec-payment-form (e.g formData.selectedShippingMethod will reset if checkout token object shipping option change)

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

      useCommerceComponent: true,
    }
  },
  watch: {
    cart(newCart, oldCart) {
      if (newCart !== oldCart) {
        if (newCart.total_items === 0) { // cart changed the
          this.checkout = null // clear checkout token object if cart empty now
          alert("You must add items to your cart to contiue checkout")
          return;
        }
      }
    },
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
    removeProductFromCart(itemId) {
      this.$emit('remove-product-from-cart', itemId)
    },
    /**
     * handle invoking payment-form captureOrderCallBack on checkout form button 'click' event 
     */
    handleFormSubmit(paymentFormCaptureOrderCallBack) {
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

      paymentFormCaptureOrderCallBack()
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
        let errorToAlert = '';
        const { error = {} } = data
        if (error.type === 'validation') { // catch validation errors and update corresponding data/state
          error.message.forEach(({param, error}) => {
            this.errors = {
              ...this.errors,
              [param]: error
            }
          })

          const allErrors = error.message.reduce((string, error) => {
            return `${string} ${error.error}`
          }, '') // accumalate a string of errors using reduce
          errorToAlert = allErrors;
        }

        if (error.type === 'gateway_error' || error.type === 'not_valid' || error.type === 'bad_request') { // either a gateway error or a shipping error and update corresponding data/state
          this.errors = {
            ...this.errors,
            [(error.type === 'not_valid' ? 'fulfillment[shipping_method]' : error.type)]: error.message
          }
          errorToAlert = error.message
        }

        if (exceededMinLifetime) { // after handling errors update loading UI
          this.loading = {
            ...this.loading,
            order: false
          }
          alert(errorToAlert)
        } else {
          clearInterval(secondsInterval);
          clearTimeout(lifetimeTimeout)
          const remainingSecondsToWait = this.capturingOrderLoadingScreenMinLifetime - secondsPassed;
          setTimeout(() => {
            this.loading = {
              ...this.loading,
              order: false
            }
            alert(errorToAlert)
          }, remainingSecondsToWait)
        }
      })
    },

  }
}
</script>