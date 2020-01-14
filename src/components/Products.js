import React, { Component } from 'react';
import { FootPrintsLoading as Loading } from './Loaders';
import ProductDetail from './ProductDetail';

class Products extends Component {
  render() {
    if (this.props.products) {
      const allProducts = this.props.products.map((product, id) => {
        return (
          <ProductDetail
              key={id}
              product={product}
              addProductToCart={this.props.addProductToCart}
            />
        )
      })
      return this.props.products.length ?
      (
        <div className="w-100">
          {allProducts.reverse()}
        </div>
      ) :
      (
        <div className="flex self-stretch w-100 justify-center items-center">
          <p className="medium-text f6 tracked-mega ttu dark-gray tracked-mega">
            There are currently no items for sale.
          </p>
        </div>
      )
    }
    return (
      <Loading />
    )
  }
}

export default Products
