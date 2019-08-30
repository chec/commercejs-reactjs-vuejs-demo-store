import { Component, h } from 'panel';

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

  constructor() {
    super();
    this.addProductToCart = this.addProductToCart.bind(this)
  }

  handleSizeSelect(e) {
    this.update({
      selectedSize: e.target.value
    })
  }

  addProductToCart(e) {
    const product = {
      productId: this.product.id,
      variant: {
        [this.product.variants[0].id]: this.state.selectedSize
      }
    }
    this.$panelRoot.addProductToCart(product)
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
                    click: this.addProductToCart
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
              selectName: 'selectedSize',
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

export default ProductDetail;
