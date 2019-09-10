import React, { Component } from 'react';
import { FootPrintsLoading as Loading } from './Loaders';
import ProductDetail from './ProductDetail';

class Products extends Component {
  render() {
    const allProducts = this.props.products.map((product, id) => {
      return (
        <ProductDetail
            product={product}
            addProductToCart={this.props.addProductToCart}
          />
      )
    })
    if (this.props.products.length) {
      return (
        <div className="w-100">
          {allProducts.reverse()}
        </div>
      )
    }
    return (
      <Loading />
    )
  }
}

export default Products
