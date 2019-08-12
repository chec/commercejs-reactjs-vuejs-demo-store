import React, { Component } from 'react';

class CartCheckout extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="flex flex-grow-1 bg-tan-white w-100">
        <div className="cf mw9 center w-100 ph2">
            <div className="fl w-40 ph4">
                <div className="relative z-1 h5 br3 bg-dark-gray w-100">

                </div>
                <div className="pt4 pb3 nt3 br3 ph4 bg-cherry">
                  <div className="flex justify-between items-center w-100 medium-text f7 white ttu">
                    <p className="tracked-mega-1">
                      subtotal
                    </p>
                    <p className="">
                      $100.00
                    </p>
                  </div>
                </div>
            </div>
            <div className="fl w-60 ph4">

            </div>
        </div>
      </div>
    )
  }
}

export default CartCheckout;
