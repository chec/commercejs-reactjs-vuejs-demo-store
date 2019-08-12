import setUpShadowAndRender from '../utils/setUpShadowAndRender'
import WithComponentState from '../utils/withComponentState';

window.pushStateAndTriggerPopStateEvent = (pathname) => {
  history.pushState({}, null, pathname);
  const popStateEvent = new PopStateEvent('popstate', {});
  window.dispatchEvent(popStateEvent);
}

class App extends WithComponentState() {

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
      <x-header cart="${escape(JSON.stringify(this.state.cart))}"></x-header>
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
      </main>
      <x-footer class="flex bg-black-90"></x-footer>
    `;
  }
}

export default App;
