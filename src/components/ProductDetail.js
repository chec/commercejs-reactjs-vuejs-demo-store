import React, { Component } from 'react';
import Loading from './Loading';

class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSize: ''
    }
  }
  render() {
    const {
      product
    } = this.props;
    const {
      selectedSize
    } = this.state;
    if (!product) {
      return (
        <Loading />
      )
    }
    return (
      <div className="productDetail w-100 pb5 ph4">
        <div className="mw8 center ph2">
          <div className="cf flex flex-row items-center">
            <div className="fl flex flex-column flex-grow-1 items-center justify-center mw6 mt6">
              <p className="large-title-text dark-gray w-100 ttl tc">
                {product.name}
              </p>
              <p className="medium-body-text gray w-90 tc">
                lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
              </p>
              <button
                disabled={!!selectedSize}
                name="addToCartButton"
                className="button button__add-to-cart white ttu bg-dark-gray tracked-mega-1 w-100 mv3 ${!!this.state.selectedSize ? 'dim' :'o-30'}">
                add to cart
              </button>
            </div>
            <div className="fl w-50 self-start relative">
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
{/*          ${renderLabel({
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
        */}
        </div>
      </div>
    )
  }
}

export default ProductDetail;
