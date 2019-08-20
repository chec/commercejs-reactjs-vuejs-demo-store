<template>
<div>
    <Header :cart={cart} location={this.props.location} />
    <main id="main" class="flex">
      <router-view
        @add-product-to-cart="addProductToCart"
        :product="products.length ? products[0] : null" />
    </main>
    <footer class="footer flex pa4 bg-black-90 bg-red-m bg-green-l">
        <div class="self-end w-100">
          <p class="medium-text tc cherry">
            © 2019 CHEC PLATFORM/COMMERCEJS
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
  created() {
    if (this.commerce !== undefined && typeof this.commerce !== 'undefined') {
      this.commerce.Products.list(
        (resp) => {
          //Success
          this.products = [
              ...resp.data.map(product => ({
                ...product,
                variants: product.variants.map(variant => ({
                  ...variant,
                  optionsById: variant.options.reduce((obj, currentOption) => {
                      obj[currentOption.id] = {
                        ...currentOption,
                        variantId: variant.id
                      }
                      return obj;
                    }, {})
                }))
              }))
            ]
        },
        (error) => {
          // handle error properly in real-world
          // eslint-disable-next-line
          console.log(error)
        }
      );
      window.addEventListener("Commercejs.Cart.Ready", function () {
        // invoke commerce cart method to retrieve cart in session
        this.commerce.Cart.retrieve((cart) => {
          if (!cart.error) {
            this.cart = cart;
          }
        });
      }.bind(this))
    }
  },
  methods: {
    // adds product to cart by invoking Commerce.js's Cart method 'Cart.add'
    // https://commercejs.com/docs/api/?javascript#add-item-to-cart
    addProductToCart({ productId, variant}) {
      this.commerce.Cart.add({
        id: productId,
        variant
      }, (resp) => {
        // if successful update Cart
        if (!resp.error) {
          this.cart = resp.cart
          alert("Added to cart!")
        }
      });
    }

  },
  props: {
    commerce: {
      required: true,
      type: Object
    }
  },
  data: function() {
    return {
      products: [],
      cart: null,
      order: null
    }
  }
}
</script>
