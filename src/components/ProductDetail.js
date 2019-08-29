import { Component, h } from 'panel';

import setUpShadowAndRender from '../utils/setUpShadowAndRender';
import WithComponentState from '../utils/withComponentState';
import parseProp from '../utils/unescapeAndParseAttribute';

function renderLabel(props) {
  return h('div', { attrs: { class: props.classes || '' }}, [
    h('p', { attrs: { class: 'medium-text ttu gray f6 tracked-mega-1 pb2'}}, [
      props.labelTitle
    ]),
    h('p', { attrs: { class: 'large-title-text f1 fw9 ttu pl3'}}, [
      props.body
    ]),
  ])
}

function renderSelect(props) {
  const renderOptions = props.options.map(option => {
    return h('option', { attrs: { value: option.value, selected: ((props.selectedValue === option.value) ? 'selected' : '')}}, [
      option.description || ''
    ])
  })

  return h('div', { attrs: { class: `relative ${props.classes || ''}`}}, [
    renderLabel({
      labelTitle: props.labelTitle,
      body: props.labelBody,
      classes: props.labelClasses
    }),
    h('select', { on: { input: props.onInput }, attrs: { class: 'absolute absolute--fill left-0 o-0 pointer w-100'}}, [
      h('option', { attrs: { value: '', disabled: true, selected: 'selected'}}, [
        'Choose a size'
      ]),
      ...renderOptions
    ])
  ])
}

class ProductDetail extends Component {

  handleSizeSelect(e) {
    this.update({
      selectedSize: e.target.value
    })
  }

  get config() {
    return {
      defaultState: {
        selectedSize: ''
      },

      template: props => {
        console.log('this is the props of ProductDetail', {...this})
        this.product = props.products.length ? props.products[0] : null
        const sizeOptions = this.product ?
          this.product.variants[0].options.map(option => ({ value: option.id, description: option.name })) :
          [];
        const sizeOptionsById = this.product ?
          this.product.variants[0].options.reduce((obj, currentOption) => {
            obj[currentOption.id] = currentOption;
            return obj;
          }, {}) :
          {};
        return this.product ? h('div', { attrs: { class: 'productDetail w-100 pb5 ph4'}}, [
          h('div', { attrs: { class: 'mw8 center ph2'}}, [
            h('div', { attrs: { class: 'cf flex flex-row items-center'}}, [
              h('div', { attrs: { class: 'fl flex flex-column flex-grow-1 items-center justify-center mw6 mt6'}}, [
                h('p', { attrs: { class: 'large-title-text dark-gray w-100 ttl tc'}}, [
                  this.product.name
                ]),
                h('p', { attrs: { class: 'medium-body-text gray w-90 tc'}}, [
                  'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum'
                ]),
                h('button', {
                  on: {
                    click: () => this.$panelRoot.addProductToCart(this.product.id)
                  },
                  class: {
                    'dim': !!this.state.selectedSize,
                    'o-30': !!!this.state.selectedSize
                  },
                  attrs: {
                    disabled: !!!this.state.selectedSize,
                    class: 'button button__add-to-cart white ttu bg-dark-gray tracked-mega-1 w-100 mv3'
                  }}, [
                  'add to cart'
                ])
              ]),
              h('div', { attrs: { class: 'fl w-50 self-start relative'}}, [
                h('img', { attrs: { src: this.product.media.source, width: '100%', height: 'auto'}}),
                h('div', { attrs: { class: 'absolute absolute--fill flex justify-end items-end ml4' }}, [
                  h('div', { attrs: { class: 'rotate-lift pr2'}}, [
                    h('p', { attrs: { class: 'medium-text ttu gray f6 tracked-mega-1 pb2 b'}}, [
                      'type'
                    ]),
                    h('p', { attrs: { class: 'large-title-text f1 fw9 ttu pl3'}}, [
                      'brand'
                    ])
                  ])
                ])
              ])
            ])
          ]),
          h('div', { attrs: { class: 'productDetail__info-container mw8 center flex flex-row flex-grow-1 pb4 mt4'}}, [
            renderLabel({
              labelTitle: 'price',
              body: '$100.00 USD',
              classes: 'mr5'
            }),
            renderSelect({
              labelTitle: 'choose a size',
              labelBody: sizeOptionsById[this.state.selectedSize] ? sizeOptionsById[this.state.selectedSize].name : 'choose a size',
              selectName: 'sizeSelect',
              selectedValue: this.state.selectedSize,
              options: sizeOptions,
              onInput: this.handleSizeSelect.bind(this)
            })
          ])
        ]) : h('div', 'loading')
      }
    }
  }
}

class _ProductDetail extends WithComponentState() {

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
