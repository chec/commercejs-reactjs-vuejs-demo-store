import setUpShadowAndRender from '../utils/setUpShadowAndRender'

// assets
import imagePlaceholder from '../assets/image-placeholder-no-shadow.png';

function renderButton(props) {
  return `
    <div>
      <p class="medium-text ttu gray f6 tracked-mega-1 pb2">
        price
      </p>
      <p class="large-title-text f1 fw9">
        $100.00 USD
      </p>
    </div>
  `;
}


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
            <div class="fl flex-grow-1 items-center justify-center mw6 mt6">
              <p class="large-title-text dark-gray w-100">
                white shoes
              </p>
              <p class="medium-body-text gray w-90">
                lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
              </p>
              <button class="button button__add-to-cart white ttu bg-dark-gray tracked-mega-1 w-80 mv3">
                add to cart
              </button>
            </div>
            <div class="fl w-50 self-start">
              <img src=${imagePlaceholder} width="100%" height="auto" />
            </div>
          </div>
        </div>
        <div class="productDetail__info-container mw8 center flex flex-row flex-grow-1 pb4">
          ${renderButton()}
        </div>
      </div>
    `
  }
}

export default ProductDetail;
