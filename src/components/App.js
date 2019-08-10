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
    this.commerce = new window.Commerce(process.env.COMMERCEJS_PUBLIC_KEY, (process.env.NODE_ENV === 'development') ? true : false);
  }

  connectedCallback(){
    setUpShadowAndRender.call(this, undefined, true)
  }

  render() {
    return `
      <x-header cart="${JSON.parse(this.state.cart)}"></x-header>
      <main id="main" class="flex">
        <landing-page class="flex flex-grow-1 items-center"></landing-page>
      </main>
      <x-footer></x-footer>
    `;
  }
}

export default App;
