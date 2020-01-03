<template>
<div>
    <Header :cart="cart" :cartAnimation="cartAnimation" />
    <main id="main" class="flex">
      <router-view
        @add-product-to-cart="addProductToCart"
        @remove-product-from-cart="removeProductFromCart"
        :products="products"
        :cart="cart"
        :order="order"
        @update:cart="cart = $event"
        @refresh-cart="refreshCart"
        @update:order="order = $event"
      />
    </main>
    <footer class="footer flex pa4 bg-black-90 bg-red-m bg-green-l">
        <div class="self-end w-100">
          <p class="medium-text tc cherry">
            © 2020 CHEC PLATFORM/COMMERCEJS
          </p>
        </div>
    </footer>
</div>

</template>

<script>
import Header from './components/Header'
import './styles/application.scss'

export default {
  name: 'app',
  components: {
    Header
  },
  data: function() {
    return {
      products: [],
      cart: null,
      order: null,
      cartAnimation: false,
    }
  },
  created() {
    // invokes Commerce.js method commerce.cart.retrieve
    // and saves the initial Commercejs Cart Object to state/data this.cart
    this.retrieveCart()

    // invokes Commerce.js method commerce.products.list
    // and saves all the Products to this.products
    this.getAllProducts()
  },
  methods: {
    // retrieve initial cart object
    retrieveCart() {
      this.$commerce.cart.retrieve().then(cart => {
        this.cart = cart
      }).catch(error => {
        // eslint-disable-next-line no-console
        console.log('There was an error retrieving the cart', error)
      });
    },
    // retrieve and list all products
    // https://commercejs.com/docs/api/#list-all-products
    getAllProducts() {
      this.$commerce.products.list().then(
        (resp) => {
          this.products = [
              ...resp.data.map(product => { // spread out product objects into array assigned to this.products
                return {
                  ...product, // spread the current iteration's product's items on to the object returned
                  variants: (!product.variants && []) || product.variants.map(variant => {
                    return { // modify the shape of the product's variants mapping the options by id for easier selection
                      ...variant,
                      optionsById: variant.options.reduce((obj, currentOption) => {
                          obj[currentOption.id] = {
                            ...currentOption,
                            variantId: variant.id
                          }
                          return obj;
                      }, {})
                    }
                  })
                }
              })
            ]
        }
      ).catch(
        (error) => {
          // eslint-disable-next-line no-console
          console.log(error)
        }
      );
    },
    // adds product to cart by invoking Commerce.js's Cart method commerce.cart.add
    // https://commercejs.com/docs/api/?javascript#add-item-to-cart
    addProductToCart({ productId, variant}) {
      if (this.cartAnimation) {
        this.cartAnimation = false // ensure cartAnimation flag is reset
      }
      this.$commerce.cart.add(
        productId,
        '1',
        variant
      ).then(resp => {
        // if successful update cart and animate cart UI
        this.cartAnimation = true
        this.cart = resp.cart
      }).catch(error => {
        // eslint-disable-next-line no-console
        console.log(error)
      })
    },
    // removes product from cart by invoking Commerce.js's Cart method 'Cart.remove'
    // https://commercejs.com/docs/api/?javascript#remove-item-from-cart
    removeProductFromCart(lineItemId) {
      return this.$commerce.cart.remove(lineItemId).then((resp) => {
        this.cart = resp.cart
        return resp
      })
    },
    refreshCart() {
      this.$commerce.cart.refresh(() => {
        // successful
        this.cart = this.$commerce.cart.cart // TODO: when Commercejs.cart.refresh v2 resolves
        // with resp.cart object rather resp.cartId, assign with resp not with $commerce.cart.cart
      }, error => {
        // eslint-disable-next-line no-console
        console.log(error)
      })
    }
  }
}
</script>
