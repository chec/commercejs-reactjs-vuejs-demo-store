import React, { Component, Fragment } from 'react';
import { Route, Switch, withRouter } from "react-router-dom";
import commerce from './lib/commerce';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Products from './components/Products';
import ProductDetail from './components/ProductDetail';
import CartCheckout from './components/CartCheckout';
import ThankYou from './components/ThankYou';

class App extends Component {
  constructor(props) {
    super(props);
    this.addProductToCart = this.addProductToCart.bind(this);
    this.removeProductFromCart = this.removeProductFromCart.bind(this);
    this.captureOrder = this.captureOrder.bind(this);
    this.refreshCart = this.refreshCart.bind(this);
    this.updateQuantity = this.updateQuantity.bind(this);
    this.retrieveCart = this.retrieveCart.bind(this);
    this.state = {
      products: [],
      cart: null,
      order: null,
      playCartAnimation: false
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if ( prevState.cart && prevState.cart.total_items !== this.state.cart.total_items) {
      this.setState({
        playCartAnimation: true
      })
    }
  }

  componentDidMount() {
    this.retrieveCart()
    commerce.products.list().then(
      (resp) => {
        //Success
        this.setState({
          products: [
            ...resp.data.map(product => ({
              ...product,
              variants: product.variants ? product.variants.map(variant => ({
                ...variant,
                optionsById: variant.options.reduce((obj, currentOption) => {
                    obj[currentOption.id] = {
                      ...currentOption,
                      variantId: variant.id
                    }
                    return obj;
                  }, {})
              })) : []
            }))
          ] || []
        })
      }
    ).catch(
      (error) => {
        // handle error properly in real-world
        console.log(error)
      }
    );
  }

  retrieveCart(){
    commerce.cart.retrieve().then(cart => {
      this.setState({
        cart
      })
    }).catch(error => console.log(error));
  }

  // adds product to cart by invoking Commerce.js's Cart method 'Cart.add'
  // https://commercejs.com/docs/api/?javascript#add-item-to-cart
  addProductToCart(product) {
    this.setState({
      playCartAnimation: false
    })
    const {
      productId,
      variant
    } = product

    commerce.cart.add({
      id: productId,
      variant
    }).then(resp => {
      // if successful update Cart
        this.setState({
          cart: resp.cart
        })
    }).catch(error => console.log(error))
  }

  // cart methods
  removeProductFromCart(lineItemId) {
    return commerce.cart.remove(lineItemId).then((resp) => {
      this.setState({
        cart: resp.cart
      })
      return resp
    })
  }

  // refreshes cart
  refreshCart(){
    commerce.cart.refresh().then(resp => {
      this.retrieveCart()
    }).catch(error => console.log(error))
  }

  captureOrder(checkoutId, order) {
    // upon successful capturing of order, refresh cart, and clear checkout state, then set order state
    return commerce.checkout
      .capture(checkoutId, order).then(resp => {
        this.refreshCart()
        this.setState({
          checkout: null,
          order: resp
        })
        return resp;
      }).catch(({response}) => {
        console.log(response.data.error)
        throw response.data;
      })
  }

  updateQuantity(lineItemId, quantity) {
    return commerce.cart.update(lineItemId, { quantity }).then(
      resp => {
        // if (resp.cart.total_items === 0) {
        //   this.setState({
        //     checkout: null
        //   }, () => alert("Add items to your cart before to continue checkout."))
        // } we won't need something like this, since when given quantity 0, Commercejs does
        // not make line-item 0 but rather leaves it at 1
        return this.setState({
          cart: resp.cart
        })
      })
  }



  render() {
    const {
      cart,
      products
    } = this.state;
    return (
      <Fragment>
        {
          <Header rootClasses={`${this.props.location.pathname === '/cart-checkout' && 'clip'}`} cart={cart} location={this.props.location} playCartAnimation={this.state.playCartAnimation}/>
        }
        <main id="main" className="flex">
          <Switch>
           <Route path="/" exact component={LandingPage} />
           <Route
              path="/products"
              render={(props) => {
                return (
                  <Products
                    {...props}
                    products={products}
                    addProductToCart={this.addProductToCart}
                  />
                )
              }}
          />
          <Route
            path="/cart-checkout"
            render={(props) => {
              return (
                <CartCheckout
                  {...props}
                  cart={cart}
                  commerce={commerce}
                  removeProductFromCart={this.removeProductFromCart}
                  captureOrder={this.captureOrder}
                  updateQuantity={this.updateQuantity}
                />
              )
          }}
          />
          <Route path="/thank-you" render={(props) => {
              if (!this.state.order) {
                return props.history.push("/")
              }
              return <ThankYou {...props} order={this.state.order} />
            }}/>
          </Switch>
        </main>
        <footer className="footer flex pa4 bg-black-90 bg-red-m bg-green-l">
          <div className="self-end w-100 flex flex-column justify-center">
            <a href="https://icons8.com" className="medium-text white-70 f8 ttu lh-title center mv2 tc">
              design resources from icons8.com
            </a>
            <p className="medium-text tc cherry mv2">
              © 2019 CHEC PLATFORM/COMMERCEJS
            </p>
          </div>
        </footer>
      </Fragment>
    )
  }
}

export default withRouter(App);
