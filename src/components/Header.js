import setUpShadowAndRender from '../utils/setUpShadowAndRender'

// svg
import logo from '../assets/logo.svg'
import cartIcon from '../assets/cart-icon.svg'

class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    setUpShadowAndRender.call(this, undefined, true);
  }

  render() {
    return `
      <header class="absolute w-100 ph4 pv5 flex flex-row justify-between">
        <div class="logoContainer">
          <img src=${logo} width="100%" height="100%" />
        </div>
        <div class="flex">
          <div class="productFragmentContainer">
            <p class="medium-text f7 cherry ttu rotate-270 pa2 bg-white nr3">
              pre-order now
            </p>
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
