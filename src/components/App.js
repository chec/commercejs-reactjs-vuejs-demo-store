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
    this.removeProductFromCart = this.removeProductFromCart.bind(this)
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
          this.navigate("thank-you")
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
        order: null,
        $view: "", // default view /# or /,
      },

      routes: {
        '': () => ({ $view: 'landing-page', classes: 'flex flex-grow-1 items-center bg-black' }),
        'white-shoe': () => ({ $view: 'product-detail', classes: 'flex flex-grow-1'}),
        'cart-checkout': () => ({ $view: 'cart-checkout', classes: 'flex flex-grow-1 bg-tan-white'})
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
