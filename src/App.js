import React, { Component } from 'react';
import Header from './components/Header';

class App extends Component {
  constructor(props) {
    super(props);
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
            products: resp.data || []
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
  render() {
    const {
      cart
    } = this.state;
    return (
      <div>
        <Header cart={cart}/>
        <main id="main" class="flex">
        </main>
        <footer class="footer flex pa4 bg-black-90">
          <div class="self-end w-100">
            <p class="medium-text tr cherry">
              © 2019 CHEC PLATFORM/COMMERCEJS
            </p>
          </div>
        </footer>
      </div>
    )
  }
}

export default App;
