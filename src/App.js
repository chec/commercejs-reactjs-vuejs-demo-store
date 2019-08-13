import React, { Component } from 'react';
import { Route, Switch, Link, BrowserRouter as Router, withRouter } from "react-router-dom";
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import ProductDetail from './components/ProductDetail';
import CartCheckout from './components/CartCheckout';

class App extends Component {
  constructor(props) {
    super(props);
    this.addProductToCart = this.addProductToCart.bind(this);
    this.removeProductFromCart = this.removeProductFromCart.bind(this);
    this.state = {
      products: [],
      cart: null,
      checkout: null,
      order: null,
    }
  }
  componentDidMount() {
    const {
      commerce
    } = this.props;
    if (commerce !== undefined && typeof commerce !== 'undefined') {
      commerce.Products.list(
        (resp) => {
          //Success
          this.setState({
            products: [
              ...resp.data.map(product => ({
                ...product,
                variants: product.variants.map(variant => ({
                  ...variant,
                  optionsById: variant.options.reduce((obj, currentOption) => {
                      obj[currentOption.id] = {
                        ...currentOption,
                        variantId: variant.id
                      }
                      return obj;
                    }, {})
                }))
              }))
            ] || []
          })
        },
        (error) => {
          // handle error properly in real-world
          console.log(error)
        }
      );
      window.addEventListener("Commercejs.Cart.Ready", function () {
        // invoke commerce cart method to retrieve cart in session
        commerce.Cart.retrieve((cart) => {
          if (!cart.error) {
            this.setState({
              cart
            })
          }
        });
      }.bind(this))
    }
  }

  // adds product to cart by invoking Commerce.js's Cart method 'Cart.add'
  // https://commercejs.com/docs/api/?javascript#add-item-to-cart
  addProductToCart(product) {
    const {
      productId,
      variant
    } = product

    this.props.commerce.Cart.add({
      id: productId,
      variant
    }, (resp) => {
      // if successful update Cart
      if (!resp.error) {
        this.setState({
          cart: resp.cart
        })
        alert("Added to cart!")
      }
    });
  }

  // cart methods
  removeProductFromCart(lineItemId) {
    this.props.commerce.Cart.remove(lineItemId, (resp) => {
      // if successful update Cart
      if (!resp.error) {
        this.setState({
          cart: resp.cart
        })
      }
    });
  }

  render() {
    const {
      cart,
      products
    } = this.state;
    return (
        <div>
          {
            (this.props.location.pathname !== '/cart-checkout') &&
            <Header cart={cart}/>
          }
          <main id="main" className="flex">
            <Switch>
              <Route path="/" exact component={LandingPage} />
              <Route path="/white-shoe" render={(props) => {
                return (
                  <ProductDetail
                    {...props}
                    product={products.length ? products[0] : null}
                    addProductToCart={this.addProductToCart}
                  />
                )}}
              />
            <Route path="/cart-checkout" render={(props) => {
                return (
                  <CartCheckout
                    {...props}
                    cart={cart}
                    commerce={this.props.commerce}
                    removeProductFromCart={this.removeProductFromCart}
                  />
                )
              }} />
            </Switch>
          </main>
          <footer className="footer flex pa4 bg-black-90">
            <div className="self-end w-100">
              <p className="medium-text tc cherry">
                © 2019 CHEC PLATFORM/COMMERCEJS
              </p>
            </div>
          </footer>
        </div>
    )
  }
}

export default withRouter(App);
