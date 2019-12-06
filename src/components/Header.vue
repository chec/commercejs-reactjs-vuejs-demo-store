<template>
  <header class="headerContainer absolute w-100 ph4 ph5-l pv5 pv5-l flex flex-row justify-between items-center z-1" :class="{ 'headerContainer--products-page': $route.name === 'products', clip: $route.name === 'cart-checkout' }">
    <router-link to="/">
      <div
        class="logoContainer dim pointer w-70 w-85-l"
        :class="[isThankYouPathname ? 'fill-cherry' : 'fill-near-white']"
      >
        <LogoSvg width="100%" height="auto"/>
      </div>
    </router-link>
    <div class="flex" :class="{ 'scale-animation': cartAnimation }">
      <router-link to="cart-checkout" class="flex flex-row items-center no-underline dim">
        <div
          class="cartIconContainer pointer"
          :class="[isThankYouPathname ? 'fill-cherry' : 'fill-near-white']"
        >
          <CartIconSvg  width="100%" height="100%"/>
        </div>
        <p class="medium-text f7"
          :class="[isThankYouPathname ? 'cherry' : 'white']"
        >
          {{ cart ? cart.total_items : '0'}}
        </p>
      </router-link>
    </div>
  </header>
</template>
<script>
import LogoSvg from '../assets/logo.svg'
import CartIconSvg from '../assets/cart-icon.svg'

export default {
  name: 'Header',
  props: {
    cart: {
      required: true,
    },
    cartAnimation: {
      required: true
    }
  },
  components: {
    LogoSvg,
    CartIconSvg
  },
  computed: {
    isThankYouPathname() {
      return this.$route.name === 'thank-you';
    }
  }
}
</script>
