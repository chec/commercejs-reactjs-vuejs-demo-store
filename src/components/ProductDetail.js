import React, { Component } from 'react';
import Loading from './Loading';

function Label(props) {
  return (
    <div className={`${props.classes || ''} `}>
      <p className="medium-text ttu gray f6 tracked-mega-1 pb2">
        {props.labelTitle || '----'}
      </p>
      <p className="large-title-text f2 f1-m fw9 ttu pl3">
        {props.body || (props.placeholder || '----')}
      </p>
    </div>
  )
}


class ProductDetail extends Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
    this.addProductToCart = this.addProductToCart.bind(this)
    this.state = {
      sizeSelect: ''
    }
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  addProductToCart(e) {
    const product = {
      productId: this.props.product.id,
      variant: {
        [this.props.product.variants[0].id]: this.state.sizeSelect
      }
    }
    this.props.addProductToCart(product)
  }

  render() {
    const {
      product
    } = this.props;
    const {
      sizeSelect
    } = this.state;

    if (!product) {
      return (
        <Loading />
      )
    }

    return (
      <div className="productDetail w-100 pb5 ph4">
        <div className="mw8 center ph2">
          <div className="cf flex flex-column flex-row-l items-center">
            <div className="fl flex flex-column flex-grow-1 items-center justify-center mw6 mt6-l order-1 order-0-l">
              <p className="large-title-text dark-gray w-100 ttl tc">
                {product.name}
              </p>
              <p className="medium-body-text gray w-90 tc">
                lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
              </p>
              <button
                disabled={!!!sizeSelect}
                onClick={this.addProductToCart}
                name="addToCartButton"
                className={`button button__add-to-cart white ttu bg-dark-gray tracked-mega-1 w-100 mv3 ${!!this.state.sizeSelect ? 'dim' :'o-30'}`}>
                add to cart
              </button>
            </div>
            <div className="fl w-80 w-50-l self-start-l relative">
              <img src={product.media.source} width="100%" height="auto" />
              <div className="absolute absolute--fill flex justify-end items-end ml4">
                <div className="rotate-lift pr2">
                  <p className="medium-text ttu gray f6 tracked-mega-1 pb2 b">
                    type
                  </p>
                  <p className="large-title-text f1 fw9 ttu pl3">
                    brand
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="productDetail__info-container mw8 center flex flex-row flex-grow-1 pb4 mt4">
          <Label
            labelTitle='price'
            body='$100.00 USD'
            classes='mr5'
          />
          <div className="relative">
            <Label
              labelTitle='size'
              placeholder="choose a size"
              body={product.variants[0].optionsById[sizeSelect] &&  product.variants[0].optionsById[sizeSelect].name }
            />
            <select
              onChange={this.handleChange}
              className="absolute absolute--fill left-0 o-0 pointer w-100"
              value={sizeSelect}
              name='sizeSelect'>
              <option value="" disabled>Choose a size</option>
              {
                product.variants[0].options.map(option =>
                  <option value={option.id} key={option.id}>
                    {option.name}
                  </option>
                )
              }
            </select>
          </div>
        </div>
      </div>
    )
  }
}

export default ProductDetail;
