import setUpShadowAndRender from '../utils/setUpShadowAndRender'
import WithComponentState from '../utils/withComponentState'

// svg
import logo from '../assets/logo.svg';
import cartIcon from '../assets/cart-icon.svg';
import pairShoes from '../assets/pair-shoes-small.png';


class Header extends WithComponentState() {
  constructor() {
    super();
  }

  connectedCallback() {
    setUpShadowAndRender.call(this, undefined, true);
    this.addEventListener('click', this) // add addEventListener to root to avoid inline scripting
  }

  handleEvent(e) {
    console.log('The event is:', e)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(name, oldValue, newValue);
    if (oldValue !== newValue) {
      this[name] = newValue // update all changed value, if this isn't done then setter this.componentState connected to observed attribute componentState won't get updated
    }
  }

  static get observedAttributes() {
    return ['componentState'];
  } // must observe componentState in order to receive updates

  render() {
    return `
      <header class="absolute w-100 ph5 pv5 flex flex-row justify-between mt3 z-1">
        <div class="logoContainer dim pointer">
          <img src=${logo} width="100%" height="100%" />
        </div>
        <div class="flex">
          <div class="productFragmentContainer mw4">
            <button
              name="pre-order-button"
              class="absolute right-0 medium-text f7 cherry bg-blossom ttu rotate-270 pv2 ph2 bg-white outline-0 dim pointer mr5 mt3">
              pre-order now
            </button>
            <div class="w-100">
              ${ this.state.hideShoe ? '' : `<img src=${pairShoes} width="100%" height="auto" />` }
            </div>
          </div>
          <div class="flex flex-row items-center">
            <div class="cartIconContainer pointer">
              <img src=${cartIcon} width="100%" height="100%" />
            </div>
            <p class="medium-text f7 white">${'0'}</p>
          </div>
        </div>
      </header>
    `
  }
}

export default Header;
