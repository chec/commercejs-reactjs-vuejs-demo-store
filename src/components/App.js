import setUpShadowAndRender from '../utils/setUpShadowAndRender'
import WithComponentState from '../utils/withComponentState';

class App extends WithComponentState() {

  constructor() {
    super();
    this.state = {
      products: [],
      cart: null,
      checkout: null,
      order: null
    }
    // here we construct a new Commercejs client using the Commerce class from the window
    // and assign it to an instance variable named this.commerce
    this.commerce = new window.Commerce(process.env.COMMERCEJS_PUBLIC_KEY, (process.env.NODE_ENV === 'development') ? true : false);
  }

  connectedCallback(){
    if (this.commerce !== undefined && typeof this.commerce !== 'undefined') {
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
  }

  render() {
    return `
      <x-header cart="${JSON.stringify(this.state.cart)}"></x-header>
      <main id="main" class="flex">
        <landing-page class="flex flex-grow-1 items-center"></landing-page>
      </main>
      <x-footer></x-footer>
    `;
  }
}

export default App;
