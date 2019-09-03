import { Component, h } from 'panel';

import setUpShadowAndRender from '../utils/setUpShadowAndRender'
import WithComponentState from '../utils/withComponentState';

window.pushStateAndTriggerPopStateEvent = (pathname) => {
  history.pushState({}, null, pathname);
  const popStateEvent = new PopStateEvent('popstate', {});
  window.dispatchEvent(popStateEvent);
}

class App extends Component {
  constructor() {
    super();
    this.commerce = new window.Commerce(process.env.COMMERCEJS_PUBLIC_KEY, (process.env.NODE_ENV === 'development') ? true : false);
    this.removeProductFromCart = this.removeProductFromCart.bind(this);
    this.refreshCart = this.refreshCart.bind(this)
  }

  connectedCallback() {
    super.connectedCallback(...arguments)
    this._init()
  }

  _init() {
    console.log('this instance looks like so', this.state)
    if (this.commerce !== undefined && typeof this.commerce !== 'undefined') {
      this.commerce.Products.list(
        (resp) => {
          //Success
          this.update({
            products: resp.data || []
          })
        },
        (error) => {
          // handle error properly in real-world
          console.log(error)
        }
      );
      window.addEventListener("Commercejs.Cart.Ready", function () {
        // invoke commerce cart method to retrieve cart in session
        this.commerce.Cart.retrieve((cart) => {
          if (!cart.error) {
            this.update({
              cart: cart
            })
          }
        });
      }.bind(this))
    }
  }

  refreshCart(){
    this.commerce.Cart.refresh((resp) => {
      // successful
    }, error => console.log(error))
  }

  captureOrder(checkoutId, order) {
    return new Promise((resolve, reject) => {
      // upon successful capturing of order, refresh cart, and clear checkout state, then set order state
      this.commerce.Checkout
        .capture(checkoutId, order, (resp) => {
          this.refreshCart()
          this.update({
            checkout: null,
            order: resp
          })
          debugger;
          this.navigate("#thank-you")
          return resolve(resp);
        }, (error) => {
          console.log(error)
          return reject(error)
        })
    })
  }

  // adds product to cart by invoking Commerce.js's Cart method 'Cart.add'
  // https://commercejs.com/docs/api/?javascript#add-item-to-cart
  addProductToCart(product) {
    const {
      productId,
      variant
    } = product

    this.commerce.Cart.add({
      id: productId,
      variant
    }, (resp) => {
      // if successful update Cart
      if (!resp.error) {
        this.update({
          cart: resp.cart
        })
        alert("Added to cart!")
      }
    });
  }

  updateQuantity(lineItemId, quantity) {
    return new Promise((resolve, reject) => {
      this.commerce.Cart.update(lineItemId, { quantity },
        function(resp){
          // if (resp.cart.total_items === 0) {
          //   this.setState({
          //     checkout: null
          //   }, () => alert("Add items to your cart before to continue checkout."))
          // } we won't need something like this, since when given quantity 0, Commercejs does
          // not make line-item 0 but rather leaves it at 1
          return this.update({
            cart: resp.cart
          })
        }.bind(this));
    })
  }

  // cart methods
  removeProductFromCart(lineItemId) {
    return new Promise((resolve, reject) => {
      this.commerce.Cart.remove(lineItemId, (resp) => {
        // if successful update Cart
        if (!resp.error) {
          this.update({
            cart: resp.cart
          })
          return resolve(resp)
        }
        reject(resp)
      });
    })
  }

  get config() {
    return {
      defaultState: {
        products: [],
        cart: null,
        checkout: null,
        order:   {"id":"ord_ZM8X5nnQJ5pv4q","cart_id":"cart_R5XEeBeW8xvEGl","checkout_token_id":"chkt_mwJ2YQMNz71v3w","created":1565709580,"redirect":false,"customer_reference":"XMPLCHCKT-77333","status_payment":"paid","status_fulfillment":"not_fulfilled","customer":{"email":"john@doe.com"},"currency":{"code":"USD","symbol":"$"},"extrafields":null,"shipping":{"name":"undefined undefined","street":"1161 Mission St","town_city":"San Francisco","county_state":"CA","postal_zip_code":"94103","country":"US"},"billing":[],"order":{"line_items":[{"id":"item_7RyWOwmK5nEa2V","product_id":"prod_4WJvlKMYJobYV1","product_name":"White Shoe","type":"standard","quantity":1,"price":{"raw":149.99,"formatted":"149.99","formatted_with_symbol":"$149.99","formatted_with_code":"149.99 USD"},"line_total":{"raw":149.99,"formatted":"149.99","formatted_with_symbol":"$149.99","formatted_with_code":"149.99 USD"},"variants":[{"variant_id":"vrnt_RqEv5xkEOoZz4j","option_id":"optn_yA6nld7Bg5EWbz","variant_name":"Sizes","option_name":"SIZE 7.5MEN/ 5.5 WOMEN","price":{"raw":0,"formatted":"0.00","formatted_with_symbol":"$0.00","formatted_with_code":"0.00 USD"}}],"tax":{"is_taxable":false,"taxable_amount":null,"amount":null,"breakdown":[]}}],"subtotal":{"raw":149.99,"formatted":"149.99","formatted_with_symbol":"$149.99","formatted_with_code":"149.99 USD"},"discount":[],"shipping":{"id":"ship_8XxzoBPmKlPQAZ","description":"Domestic","price":{"raw":0,"formatted":"0.00","formatted_with_symbol":"$0.00","formatted_with_code":"0.00 USD"}},"tax":{"amount":{"raw":0,"formatted":"0.00","formatted_with_symbol":"$0.00","formatted_with_code":"0.00 USD"},"included_in_price":false,"breakdown":[],"zone":null},"total":{"raw":149.99,"formatted":"149.99","formatted_with_symbol":"$149.99","formatted_with_code":"149.99 USD"},"total_with_tax":{"raw":149.99,"formatted":"149.99","formatted_with_symbol":"$149.99","formatted_with_code":"149.99 USD"},"giftcard":[],"pay_what_you_want":{"enabled":false,"minimum":null,"customer_set_price":null},"total_paid":{"raw":149.99,"formatted":"149.99","formatted_with_symbol":"$149.99","formatted_with_code":"149.99 USD"},"future_charges":[]},"payments":[{"id":"pymnt_A12Jwr44j5Pjnk","transaction_id":1565709580,"card_type":"visa","gateway":"test_gateway","amount":{"raw":149.99,"formatted":"149.99","formatted_with_symbol":"$149.99","formatted_with_code":"149.99 USD"},"reference":4242}],"pending_payments":[],"fulfillment":{"shipping":{"id":"ful_9BAmwJyA1QleXd","description":"Domestic","price":0,"shipping_method_id":"ship_8XxzoBPmKlPQAZ","provider":"chec","provider_type":"native_shipping"},"digital":null},"conditionals":{"collects_fullname":false,"collects_shipping_address":true,"collects_billing_address":false,"fulfill_shipping":true,"fulfill_digital":false,"has_available_discounts":false,"has_pay_what_you_want":false,"collects_extrafields":false,"is_cart_free":false,"has_preorder":false},"metadata":[],"fraud":[],"preorders":[],"merchant":{"id":16492,"business_name":"Example Checkout","business_description":"","status":"active","timezone":"UT8","country":"US","currency":{"symbol":"$","code":"USD"},"support_email":"john@trychec.com","logo":null,"logo_shape":null,"cover":null,"analytics":{"google":{"settings":{"tracking_id":null,"linked_domains":null}}},"has":{"logo":false,"cover":false,"analytics":false,"business_description":false}}},
        $view: "", // default view /# or /,
      },

      routes: {
        '': () => ({ $view: 'landing-page', classes: 'flex flex-grow-1 items-center bg-black' }),
        'white-shoe': () => ({ $view: 'product-detail', classes: 'flex flex-grow-1', }),
        'cart-checkout': () => ({
          $view: 'cart-checkout',
          classes: 'flex flex-grow-1 bg-tan-white',
          props: {
            commerce: this.commerce
          }
        }),
        'thank-you': () => ({
          $view: 'thank-you',
          classes: 'flex flex-grow-1',
          props: {
            order: this.state.order
          }
        })
      },

      template: state => {
        console.log('App component state updated:', this.commerce)
        return h('div', [
          (state.$view !== 'cart-checkout') ? this.child('x-header') : '',
          h('main#main.flex', {}, [
            this.child(state.$view, { attrs: { class: state.classes }})
          ]),
          h('x-footer', { attrs: { class: "flex bg-black-90" }})
        ])
      }
    }
  }
}


/* class App extends WithComponentState() {

  constructor() {
    super();
    this.state = {
      products: [],
      cart: null,
      checkout: null,
      order: null,
      pathname: window.location.pathname
    }
    // here we construct a new Commercejs client using the Commerce class from the window
    // and assign it to an instance variable named this.commerce
    this.commerce = new window.Commerce(process.env.COMMERCEJS_PUBLIC_KEY, (process.env.NODE_ENV === 'development') ? true : false);
  }

  connectedCallback(){
    if (this.commerce !== undefined && typeof this.commerce !== 'undefined') {
      this.commerce.Products.list(
        (resp) => {
          //Success
          this.setState({
            ...this.state,
            products: resp.data || []
          })
        },
        (error) => {
          // handle error properly in real-world
          console.log(error)
        }
      );
      window.addEventListener("Commercejs.Cart.Ready", function () {
        // invoke commerce cart method to retrieve cart in session
        this.commerce.Cart.retrieve((cart) => {
          if (!cart.error) {
            this.setState({
              ...this.state,
              cart: cart
            })
          }
        });
      }.bind(this))
    }
    setUpShadowAndRender.call(this, undefined, true)
    this.addEventListener('add-to-cart', this.addProductToCart.bind(this))
    window.onpopstate = () => {
      this.setState({
        ...this.state,
        pathname: window.location.pathname
      })
    } // listen to history state events
  }

  static get observedAttributes() {
    return ['componentState'];
  } // must observe componentState in order to receive updates

  // adds product to cart by invoking Commerce.js's Cart method 'Cart.add'
  // https://commercejs.com/docs/api/?javascript#add-item-to-cart
  addProductToCart(e) {
    alert(`the event is ${JSON.stringify(e.detail)}`)
    const productId = e.detail.productId;
    this.commerce.Cart.add({
      id: productId,
    }, (resp) => {
      // if successful update Cart
      if (!resp.error) {
        this.setState({
          ...this.state,
          cart: resp.cart
        })
      }
    });
  }


  render() {
    return `
      ${this.state.pathname !== "/cart-checkout" ? `<x-header cart="${escape(JSON.stringify(this.state.cart))}"></x-header>` : ''}
      <main id="main" class="flex">
        ${(this.state.pathname === "/") ? `<landing-page class="flex flex-grow-1 items-center bg-black w-"></landing-page>` : ''}
        ${(this.state.pathname === "/white-shoe") ? `
          <product-detail
            class="flex flex-grow-1"
            product="${escape(JSON.stringify(this.state.products.length ? this.state.products[0] : null))}"
          ></product-detail>
          `:
          ''
        }
        ${(this.state.pathname === "/cart-checkout") ?
        `<cart-checkout
          cart="${escape(JSON.stringify(this.state.cart))}"
          class="flex flex-grow-1 bg-tan-white"></cart-checkout>`
        : ``
        }
      </main>
      <x-footer class="flex bg-black-90"></x-footer>
    `;
  }
} */

export default App;
