import React, { Component } from 'react';

class CartCheckout extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="w-100">
        <div className="cf mw9">
            <div className="fl w-40 ph4">
                <div className="h4 br3 dark-grey w-100">

                </div>
                <div className="pt3 pb4 nt4 pb3 br3 bg-cherry">
                  <div className="flex justify-between w-100 medium-text f7 white ttu">
                    <p className="tracked-mega-1">
                      subtotal
                    </p>
                    <p className="">
                      $100.00
                    </p>
                  </div>
                </div>
            </div>
        </div>
      </div>
    )
  }
}

export default CartCheckout;
