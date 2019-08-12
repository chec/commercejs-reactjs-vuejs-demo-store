import setUpShadowAndRender from '../utils/setUpShadowAndRender';
import WithComponentState from '../utils/withComponentState';
import parseProp from '../utils/unescapeAndParseAttribute';

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
  `;
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

  handleClicks(e) {
    if (e.target.name === 'addToCartButton') {
      // emit add-to-cart event
      const addToCartEvent = new CustomEvent('add-to-cart', {
        bubbles: true,
        detail: {
          productId: this.product.id,
          variant: {
            [this.product.variants[0].id]: this.state.selectedSize
          }
        }
      });

      this.dispatchEvent(addToCartEvent)
    }
  }

  get product() {
    return parseProp.call(this, 'product')
  }

  connectedCallback() {
    setUpShadowAndRender.call(this, undefined, true)

    // we want to listen to input evens rather than change events, since change
    // events only fire when focus leaves the field
    this.addEventListener('input', this.handleSizeSelect)
    // listen to clicks events on component, so that we can do something when the event.target
    // is the add-to-cart button
    this.addEventListener('click', this.handleClicks.bind(this))
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
        obj[currentOption.id] = currentOption;
        return obj;
      }, {}) :
      {};

    return this.product &&
    `
      <div class="productDetail w-100 pb5 ph4">
        <div class="mw8 center ph2">
          <div class="cf flex flex-row items-center">
            <div class="fl flex flex-column flex-grow-1 items-center justify-center mw6 mt6">
              <p class="large-title-text dark-gray w-100 ttl tc">
                ${this.product.name}
              </p>
              <p class="medium-body-text gray w-90 tc">
                lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
              </p>
              <button
                ${!!this.state.selectedSize ? '' : 'disabled'}
                name="addToCartButton"
                class="button button__add-to-cart white ttu bg-dark-gray tracked-mega-1 w-100 mv3 ${!!this.state.selectedSize ? 'dim' :'o-30'}">
                add to cart
              </button>
            </div>
            <div class="fl w-50 self-start relative">
              <img src=${this.product.media.source} width="100%" height="auto" />
              <div class="absolute absolute--fill flex justify-end items-end ml4">
                <div class="rotate-lift pr2">
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
        <div class="productDetail__info-container mw8 center flex flex-row flex-grow-1 pb4 mt4">
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
