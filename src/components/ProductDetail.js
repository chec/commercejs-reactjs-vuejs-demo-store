import React, { Component } from 'react';
import { Loading } from './Loaders';
import { ReactComponent as ArrowIcon } from '../assets/down-arrow.svg'

function Label(props) {
  return (
    <div className={`${props.classes || ''} `}>
      <p className="medium-text ttu gray f6 tracked-mega-1 pb2">
        {props.labelTitle || ''}
      </p>
      <p className="large-title-text f2 font-3-rem-ns fw9 ttu pl3">
        {props.body || (props.placeholder || '')}
      </p>
      {props.children}
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

    return (
      <div className="productDetail w-100 pb1 ph3 ph4-ns">
        <div className="mw50rem center ph2">
          <div className="cf flex flex-column flex-row-l items-center">
            <div className="fl flex flex-column flex-grow-1 items-center justify-center w-100 w-50-l mt6-l order-1 order-0-l">
              <p className="large-title-text dark-gray w-100 ttl tl lh-title">
                {product.name}
              </p>
              <div
                className="medium-body-text gray w-100 tl"
                dangerouslySetInnerHTML={{__html: product.description}}
                ></div>
            </div>
            <div className="fl w-90 w-50-l self-start-l relative pb5 pa0-l">
              <img src={product.media.source} alt="Product" width="100%" height="auto" />
              <div className="absolute absolute--fill flex justify-end items-end ml4">
                <div className="rotate-lift-less rotate-lift-ns pr2">
                  <p className="medium-text ttu gray f6 tracked-mega-1 pb2 b">
                    type
                  </p>
                  <p className="large-title-text f2 f1-ns fw9 ttu pl3">
                    brand
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="productDetail__info-container center justify-start mw8 pb2 mt4 mt2-l ph0 ph1-ns">
            <div className="flex flex-row flex-grow-1 flex-wrap items-center">
              <Label
                labelTitle='price'
                body={`$${product.price.formatted_with_code}`}
                classes='mr4 mb3'
              />
              <div className="relative">
                <Label
                  placeholder="choose a size"
                  body={product.variants[0].optionsById[sizeSelect] &&  product.variants[0].optionsById[sizeSelect].name }
                  classes='chooseASize br1'>
                  <div className="arrowDownContainer ml2 pr3">
                    <ArrowIcon />
                  </div>
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
                </Label>
              </div>
            </div>
            <div className="w-100 w-50-l mt4 mt0-l">
              <button
                disabled={!!!sizeSelect}
                onClick={this.addProductToCart}
                name="addToCartButton"
                className={`button button__add-to-cart white ttu bg-dark-gray tracked-mega-1 w-100 mv3 ${!!this.state.sizeSelect ? 'dim' :'o-30'}`}>
                add to cart
              </button>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

export default ProductDetail;
