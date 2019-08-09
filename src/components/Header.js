import setUpShadowAndRender from '../utils/setUpShadowAndRender'

// svg
import logo from '../assets/logo.svg';
import cartIcon from '../assets/cart-icon.svg';
import pairShoes from '../assets/pair-shoes-small.png';

class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    setUpShadowAndRender.call(this, undefined, true);
  }

  render() {
    return `
      <header class="absolute w-100 ph5 pv5 flex flex-row justify-between mt3 z-1">
        <div class="logoContainer dim pointer">
          <img src=${logo} width="100%" height="100%" />
        </div>
        <div class="flex">
          <div class="productFragmentContainer mw5 mr2">
            <button class="absolute right-0 medium-text f7 cherry bg-blossom ttu rotate-270 pv2 ph2 bg-white outline-0 dim pointer mr5">
              pre-order now
            </button>
            <div class="w-100">
              <img src=${pairShoes} width="100" height="auto" />
            </div>
          </div>
          <div class="cartIconContainer pointer">
            <img src=${cartIcon} width="100%" height="100%" />
          </div>
        </div>
      </header>
    `
  }
}

export default Header;
