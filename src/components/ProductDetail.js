import setUpShadowAndRender from '../utils/setUpShadowAndRender'

// assets
import imagePlaceholder from '../assets/image-placeholder.png';

class ProductDetail extends HTMLElement {
  constructor() {
    super()
  }
  connectedCallback() {
    setUpShadowAndRender.call(this, undefined, true)
  }
  render() {
    return `
      <div class="productDetail w-100 pb5">
        <div class="mw8 center ph2">
          <div class="cf flex flex-row items-center">
            <div class="fl flex-grow-1 items-center justify-center mw6 mt5">
              <p class="large-title-text dark-gray w-100">
                white shoes
              </p>
              <p class="medium-body-text gray w-90">
                lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
              </p>
              <button class="button button__add-to-cart white ttu bg-dark-gray tracked w-80 mv3">
                add to cart
              </button>
            </div>
            <div class="fl w-50 self-start">
              <img src=${imagePlaceholder} width="100%" height="auto" />
            </div>
          </div>
        </div>
      </div>
    `
  }
}

export default ProductDetail;
