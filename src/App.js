import React, { Component } from 'react';
import { Route, Switch, Link, BrowserRouter as Router, withRouter } from "react-router-dom";
import Header from './components/Header';
import LandingPage from './components/LandingPage';
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
    this.state = {
      products: [],
      cart: null,
      order: JSON.parse(`{
        "id":"ord_ZM8X5nnQJ5pv4q","cart_id":"cart_R5XEeBeW8xvEGl","checkout_token_id":"chkt_mwJ2YQMNz71v3w","created":1565709580,"redirect":false,"customer_reference":"XMPLCHCKT-77333","status_payment":"paid","status_fulfillment":"not_fulfilled","customer":{"email":"john@doe.com"},"currency":{"code":"USD","symbol":"$"},"extrafields":null,"shipping":{"name":"undefined undefined","street":"1161 Mission St","town_city":"San Francisco","county_state":"CA","postal_zip_code":"94103","country":"US"},"billing":[],"order":{"line_items":[{"id":"item_7RyWOwmK5nEa2V","product_id":"prod_4WJvlKMYJobYV1","product_name":"White Shoe","type":"standard","quantity":1,"price":{"raw":149.99,"formatted":"149.99","formatted_with_symbol":"$149.99","formatted_with_code":"149.99 USD"},"line_total":{"raw":149.99,"formatted":"149.99","formatted_with_symbol":"$149.99","formatted_with_code":"149.99 USD"},"variants":[{"variant_id":"vrnt_RqEv5xkEOoZz4j","option_id":"optn_yA6nld7Bg5EWbz","variant_name":"Sizes","option_name":"SIZE 7.5MEN/ 5.5 WOMEN","price":{"raw":0,"formatted":"0.00","formatted_with_symbol":"$0.00","formatted_with_code":"0.00 USD"}}],"tax":{"is_taxable":false,"taxable_amount":null,"amount":null,"breakdown":[]}}],"subtotal":{"raw":149.99,"formatted":"149.99","formatted_with_symbol":"$149.99","formatted_with_code":"149.99 USD"},"discount":[],"shipping":{"id":"ship_8XxzoBPmKlPQAZ","description":"Domestic","price":{"raw":0,"formatted":"0.00","formatted_with_symbol":"$0.00","formatted_with_code":"0.00 USD"}},"tax":{"amount":{"raw":0,"formatted":"0.00","formatted_with_symbol":"$0.00","formatted_with_code":"0.00 USD"},"included_in_price":false,"breakdown":[],"zone":null},"total":{"raw":149.99,"formatted":"149.99","formatted_with_symbol":"$149.99","formatted_with_code":"149.99 USD"},"total_with_tax":{"raw":149.99,"formatted":"149.99","formatted_with_symbol":"$149.99","formatted_with_code":"149.99 USD"},"giftcard":[],"pay_what_you_want":{"enabled":false,"minimum":null,"customer_set_price":null},"total_paid":{"raw":149.99,"formatted":"149.99","formatted_with_symbol":"$149.99","formatted_with_code":"149.99 USD"},"future_charges":[]},"payments":[{"id":"pymnt_A12Jwr44j5Pjnk","transaction_id":1565709580,"card_type":"visa","gateway":"test_gateway","amount":{"raw":149.99,"formatted":"149.99","formatted_with_symbol":"$149.99","formatted_with_code":"149.99 USD"},"reference":4242}],"pending_payments":[],"fulfillment":{"shipping":{"id":"ful_9BAmwJyA1QleXd","description":"Domestic","price":0,"shipping_method_id":"ship_8XxzoBPmKlPQAZ","provider":"chec","provider_type":"native_shipping"},"digital":null},"conditionals":{"collects_fullname":false,"collects_shipping_address":true,"collects_billing_address":false,"fulfill_shipping":true,"fulfill_digital":false,"has_available_discounts":false,"has_pay_what_you_want":false,"collects_extrafields":false,"is_cart_free":false,"has_preorder":false},"metadata":[],"fraud":[],"preorders":[],"merchant":{"id":16492,"business_name":"Example Checkout","business_description":"","status":"active","timezone":"UT8","country":"US","currency":{"symbol":"$","code":"USD"},"support_email":"john@trychec.com","logo":null,"logo_shape":null,"cover":null,"analytics":{"google":{"settings":{"tracking_id":null,"linked_domains":null}}},"has":{"logo":false,"cover":false,"analytics":false,"business_description":false}}
      }
`),
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
    return new Promise((resolve, reject) => {
      this.props.commerce.Cart.remove(lineItemId, (resp) => {
        // if successful update Cart
        if (!resp.error) {
          this.setState({
            cart: resp.cart
          })
          return resolve(resp)
        }
        reject(resp)
      });
    })
  }

  refreshCart(){
    this.props.commerce.Cart.refresh((resp) => {
      // successful
    }, error => console.log(error))
  }

  captureOrder(checkoutId, order) {
    // upon successful capturing of order, refresh cart, and clear checkout state, then set order state
    this.props.commerce.Checkout
      .capture(checkoutId, order, (resp) => {
        this.refreshCart()
        this.setState({
          checkout: null,
          order: resp
        })
        this.props.history.replace("/thank-you")
      }, (error) => {
        alert(`${(error.error.message && error.error.message[0].error ) || 'There seems to be an error. Please try again.'}`)
        console.log(error)
      })
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
          <Header cart={cart} location={this.props.location} />
        }
        <main id="main" className="flex">
          <Switch>
            <Route path="/" exact component={LandingPage} />
            <Route
              path="/white-shoe"
              render={(props) => {
                return (
                  <ProductDetail
                    {...props}
                    product={products.length ? products[0] : null}
                    addProductToCart={this.addProductToCart}
                    />
                )}}/>
                <Route
                  path="/cart-checkout"
                  render={(props) => {
                    return (
                      <CartCheckout
                        {...props}
                        cart={cart}
                        commerce={this.props.commerce}
                        removeProductFromCart={this.removeProductFromCart}
                        captureOrder={this.captureOrder}
                        />
                    )
                  }} />
                <Route path="/thank-you" render={(props) => {
                    if (!this.state.order) {
                      return props.history.push("/")
                    }
                    return <ThankYou {...props} order={this.state.order} />
                  }}/>

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
