import setUpShadowAndRender from '../utils/setUpShadowAndRender';
import WithComponentState from '../utils/withComponentState';

function renderLabel(props) {
  return `
    <div class="${props.classes || ''}">
      <p class="medium-text ttu gray f6 tracked-mega-1 pb2">
        ${props.labelTitle || '----'}
      </p>
      <p class="large-title-text f1 fw9 ttu pl3">
        ${props.body || '----'}
      </p>
    </div>
  `;
}

function renderSelect(props) {
  const renderOptions = () => props.options.map(option => `
    <option value="${option.value}" ${(props.selectedValue === option.value) ? 'selected="selected"' : ''}">
      ${option.description}
    </option>
  `).join('')

  return `
    <div class="${props.classes || ''} relative">
      ${renderLabel({
        labelTitle: props.labelTitle,
        body: props.labelBody,
        classes: props.labelClasses
      })}

      <select class="absolute absolute--fill left-0 o-0 pointer w-100" value="${props.selectedValue || ''}" name="${props.selectName || ''}">
        <option value="" disabled selected="selected">Choose a size</option>
        ${renderOptions()}
      </select>
    </div>
  `
}

class ProductDetail extends WithComponentState() {

  constructor() {
    super();
    this.state = {
      selectedSize: ''
    }
  }

  handleSizeSelect(e) {
    if (e.target.name === 'sizeSelect') {
      this.setState({
        selectedSize: e.target.value
      })
    }
  }

  get product() {
    return JSON.parse(unescape(this.getAttribute("product")))
  }

  connectedCallback() {
    setUpShadowAndRender.call(this, undefined, true)

    // we want to listen to input evens rather than change events, since change
    // events only fire when focus leaves the field
    this.addEventListener('input', this.handleSizeSelect)
  }

  static get observedAttributes() {
    return ['componentState'];
  } // must observe componentState in order to receive updates

  render() {
    const sizeOptions = this.product ?
      this.product.variants[0].options.map(option => ({ value: option.id, description: option.name })) :
      [];
    const sizeOptionsById = this.product ?
      this.product.variants[0].options.reduce((obj, currentOption) => {
        obj[currentOption.id] = currentOption
        return obj;
      }, {}) :
      {};

    return this.product &&
    `
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
            <div class="fl w-50 self-start relative">
              <img src=${this.product.media.source} width="100%" height="auto" />
              <div class="absolute absolute--fill flex justify-end items-end ml4">
                <div class="nrotate-90 mb6 nr5">
                  <p class="medium-text ttu gray f6 tracked-mega-1 pb2 b">
                    type
                  </p>
                  <p class="large-title-text f1 fw9 ttu pl3">
                    brand
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="productDetail__info-container mw8 center flex flex-row flex-grow-1 pb4">
          ${renderLabel({
            labelTitle: 'price',
            body: '$100.00 USD',
            classes: 'mr5'
          })}
          ${renderSelect({
            labelTitle: 'choose a size',
            labelBody: sizeOptionsById[this.state.selectedSize] && sizeOptionsById[this.state.selectedSize].name,
            selectName: 'sizeSelect',
            selectedValue: this.state.selectedSize,
            options: sizeOptions
          })}
        </div>
      </div>
    `
  }
}

export default ProductDetail;
