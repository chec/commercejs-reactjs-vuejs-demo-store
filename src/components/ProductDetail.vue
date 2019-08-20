<template>
  <div v-if="product" class="productDetail w-100 pb5 ph4">
    <div class="mw8 center ph2">
      <div class="cf flex flex-column flex-row-l items-center">
        <div class="fl flex flex-column flex-grow-1 items-center justify-center mw6 mt6-l order-1 order-0-l">
          <p class="large-title-text dark-gray w-100 ttl tc">
            {{product.name}}
          </p>
          <p class="medium-body-text gray w-90 tc">
            lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
          </p>
          <button
            :disabled="!!!sizeSelect"
            @click="addProductToCart"
            name="addToCartButton"
            class="button button__add-to-cart white ttu bg-dark-gray tracked-mega-1 w-100 mv3"
            :class="[sizeSelect ? 'dim' :'o-30']"
          >
            add to cart
          </button>
        </div>
        <div class="fl w-90 w-50-l self-start-l relative pb5 pa0-l">
          <img :src="product.media.source" alt="Product" width="100%" height="auto" />
          <div class="absolute absolute--fill flex justify-end items-end ml4">
            <div class="rotate-lift pr2">
              <p class="medium-text ttu gray f6 tracked-mega-1 pb2 b">
                type
              </p>
              <p class="large-title-text f1 fw9 ttu pl3">
                brand
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="productDetail__info-container center mw8 justify-start flex flex-row flex-grow-1 flex-wrap pb4 mt4 ph3 ph1-ns">
      <Label
        labelTitle='price'
        body='$100.00 USD'
        :classes="['mr5-ns', 'mb4']"
      />
      <div class="relative">
        <Label
          labelTitle='size'
          placeholder="choose a size"
          :body="product.variants[0].optionsById[this.sizeSelect] &&  product.variants[0].optionsById[this.sizeSelect].name"
        />
        <select
          class="absolute absolute--fill left-0 o-0 pointer w-100"
          v-model="sizeSelect"
          name='sizeSelect'
        >
          <option value="" disabled>Choose a size</option>
          <option v-for="option in product.variants[0]" :value="option.id" :key="option.id">
            {{option.name}}
          </option>
        </select>
      </div>
    </div>
  </div>
  <p v-else>
    Loading Product
  </p>
</template>
<script>
import Label from './Label'

export default {
  name: 'ProductDetail',
  props: ['product'],
  components: {
    Label
  },
  methods: {
    addProductToCart(e) {
      const product = {
        productId: this.product.id,
        variant: {
          [this.product.variants[0].id]: this.sizeSelect
        }
      }
      this.$emit('add-product-to-cart', product)
    }
  },
  data() {
    return {
      sizeSelect: ''
    }
  }
}
</script>
