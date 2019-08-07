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
        <div class="cartIconContainer">
          <img src=${cartIcon} width="100%" height="100%" />
        </div>
      </header>
    `
  }
}

export default Header;
