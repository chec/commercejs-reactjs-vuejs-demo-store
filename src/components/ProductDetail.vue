<template>
  <div v-if="product" class="productDetail w-100 pb1 ph3 ph4-ns">
    <div class="mw50rem center ph2">
      <div class="cf flex flex-column flex-row-l items-center">
        <div class="fl flex flex-column flex-grow-1 items-center justify-center w-100 w-50-l mt6-l order-1 order-0-l">
          <p class="large-title-text dark-gray w-100 ttl tl lh-solid mb1">
            {{product.name}}
          </p>
          <div
            class="medium-body-text gray w-100 tl"
            v-html=" product.description"
            ></div>
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
      <div class="productDetail__info-container center justify-start mw8 pb2 mt4 mt2-l ph0 ph1-ns">
        <div class="flex flex-row flex-grow-1 flex-wrap items-center">
          <Label
            labelTitle='price'
            :body='"$"+product.price.formatted_with_code'
            :classes="['mr4', 'mb3']"
          />
          <div class="relative">
            <Label
              placeholder="choose a size"
              classes="chooseASize br1"
              :body="product.variants[0].optionsById[sizeSelect] &&  product.variants[0].optionsById[sizeSelect].name">
              <div className="arrowDownContainer ml2">
                <ArrowIcon />
              </div>
              <select
                class="absolute absolute--fill left-0 o-0 pointer w-100"
                v-model="sizeSelect"
                name='sizeSelect'
              >
                <option value="" disabled>Choose a size</option>
                <option v-for="option of product.variants[0].options" :value="option.id" :key="option.id">
                  {{option.name}}
                </option>
              </select>
            </Label>
          </div>
        </div>
        <div class="w-100 w-50-l mt2 mt0-l">
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
    addProductToCart() {
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
