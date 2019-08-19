<template>
  <header class="absolute w-100 ph4 ph5-l pv5 pv5-l flex flex-row justify-between items-center items-start-l z-1">
    <router-link to="/">
      <div
        class="logoContainer dim pointer w-70 w-85-l"
        :class="[isThankYouPathname() ? 'fill-cherry' : 'fill-near-white']"
      >
        <Logo />
      </div>
    </router-link>
    <div class="flex">
      <div class="productFragmentContainer mw4">
        <button
          name="pre-order-button"
          class="absolute right-0 medium-text f7 cherry bg-blossom ttu rotate-270 pv2 ph2 bg-white outline-0 dim pointer mr4 mr5-l mt3">
          pre-order now
        </button>
        <div class="w-100">
          <img src={pairShoes} alt="Pair of Shoes" width="100%" height="auto" />
        </div>
      </div>
      <router-link to="cart-checkout" class="flex flex-row items-center no-underline dim">
        <div
          class="cartIconContainer pointer"
          :class="[isThankYouPathname() ? 'fill-cherry' : 'fill-near-white']"
        >
          <CartIcon />
        </div>
        <p class="medium-text f7"
          :class="[isThankYouPathname() ? 'cherry' : 'white']"
        >
          {{ cart ? cart.total_items : '0'}}
        </p>
      </router-link>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  props: {
    cart: {
      required: true,
      type: Object
    }
  },
  computed: {
    isThankYouPathname() {
      return this.$route.name === 'thank-you';
    }
  }
}
</script>
