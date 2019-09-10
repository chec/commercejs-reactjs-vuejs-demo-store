import React, { Component } from 'react';
import pairShoes from '../assets/pair-shoes-small.png'
import sockImage from '../assets/updated-sock-image.png'

class ThankYou extends Component {
  render() {
    const allLineItems = this.props.order.order.line_items.map((item, key) => {
      return (
        <div className="flex flex-row justify-between items-center ph4 pv2" key={key}>
          <div className="w-25">
            <div
               className="aspect-ratio aspect-ratio--1x1"
               style={{
                 backgroundRepeat: "no-repeat",
                 backgroundPosition: "center",
                 backgroundSize: "contain",
                 backgroundImage: `url(${item.product_name.trim('').toLowerCase() === 'pink sock' ? sockImage : pairShoes})`
               }}
             />
          </div>
          <p className="medium-text f6 white tr ttu mw4">
            {item.name}
            <span className="db f7 pv1">
              {item.variants[0].option_name}
            </span>
            <span className="db f7">
              <span className="ttl">x</span>{item.quantity} - ${item.line_total.formatted_with_code}
            </span>
          </p>
        </div>
      )
    })
    return (
      <div className="flex flex-grow-1 bg-tan-white w-100 pt6 pb5">
        <div className="cf flex flex-column flex-row-l mw9 center w-100 ph3 mt5">
          <div className="fl w-100 w-40-l ph3">
              <div className="relative z-1 h5 br3 bg-dark-gray w-100 shadow-3 pt2 overflow-scroll">
                {allLineItems}
              </div>
              <div className="pt4 pb3 nt3 br3 ph4 bg-cherry">
                <div className="flex pb1 justify-between items-center w-100 medium-text f6 white ttu b tracked-mega-1">
                  <p>
                    total
                  </p>
                  <p className="tr">
                    ${this.props.order.order.total.formatted_with_code}
                  </p>
                </div>
              </div>
          </div>
          <div className="fl w-100 w-60-l ph3 mt4 mt0-l">
            <div className="flex flex-column items-center justify-center">
              <p className="large-title-text dark-gray tc tracked">
                Thank you for your order!
              </p>
              <div className="w-100 flex items-center mt4">
                <p className="flex-grow-1 medium-text f6 cherry ttu tracked tl br b--moon-gray pr3 pv4 lh-title">
                  a full receipt will be emailed to {this.props.order.customer.email}.
                </p>
                <div className="flex flex-column pl5">
                  <p className="medium-text f6 black ttu tracked tr mb3">
                    your details
                    <span className="db pt1 f7 mid-gray">{this.props.order.customer.email}</span>
                  </p>
                  <p className="medium-text f6 black ttu tracked tr">
                    <span className="lh-title">
                      delivery address
                    </span>
                    <span className="db pt1 f7 mid-gray">
                      {
                        this.props.order.shipping.name
                      }
                    </span>
                    <span className="db pt1 f7 mid-gray">
                      {
                        this.props.order.shipping.street
                      }
                    </span>
                    <span className="db pt1 f7 mid-gray">
                      {
                        this.props.order.shipping.town_city
                      }
                    </span>
                    <span className="db pt1 f7 mid-gray">
                      {
                        `${this.props.order.shipping.county_state}, ${this.props.order.shipping.postal_zip_code}`
                      }
                    </span>
                    <span className="db pt1 f7 mid-gray">
                      {
                        this.props.order.shipping.country
                      }
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ThankYou;
