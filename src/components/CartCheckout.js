import { Component, h } from 'panel';

// svg
import pairShoes from '../assets/pair-shoes-small.png';
import RemoveIconSvg from '../assets/RemoveIconSvg';

function CartLineItem(props) {
  return h('div', {}, [
    h('div', { attrs: { class: 'flex flex-row justify-between items-center ph4 pv2'}}, [
      h('button', {
        on: {
          click: () => props.removeProductFromCart(props.item.id)
        },
        attrs: {
          class: 'cartIconContainer dim pointer pa0 bg-none'
        }
      },[
        RemoveIconSvg()
      ]),
      h('div', {
        attrs: {
          class: 'w-25'
        }
      }, [
        h('div', {
          style: {
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "contain",
            backgroundImage: `url(${pairShoes})`
          },
          attrs: {
            class: 'aspect-ratio aspect-ratio--1x1'
          }
        })
      ]),
      h('div', { attrs: { class: "medium-text f6 white tr ttu mw4"}}, [
        props.item.name,
        h('span', { attrs: { class: "db f7 pv1"}}, [
          props.item.variants[0] ? props.item.variants[0].option_name : ''
        ]),
        h('span', { attrs: { class: "db f7"}}, [
          props.item.line_total.formatted_with_code
        ]),
        h('span', { attrs: { class: "db"}}, [
          h('div', { attrs: { class: "flex flex-row items-center justify-end"}},[
            h('button', {
              on: { click: () => props.updateQuantity(props.item.id, props.item.quantity - 1) },
              attrs: { class: "bg-none white f4 pointer grow dim ph2"}}, [
              '-'
            ]),
            h('span', { attrs: { class: "ttl"}}, [
              'x'
            ]),
            props.item.quantity,
            h('button', {
              on: { click: () => props.updateQuantity(props.item.id, props.item.quantity + 1) },
              attrs: { class: "bg-none white f5 pointer grow dim ph2"}}, [
              '+'
            ])
          ])
        ])
      ])
    ])
  ])
}

class CartCheckout extends Component {
  get config() {
    return {
      defaultState: {
        firstName: 'John',
        lastName: 'Doe',
        "customer[email]": 'john@doe.com',
        "shipping[name]": 'John Doe',
        "shipping[street]": '1161 Mission St',
        "shipping[town_city]": 'San Francisco',
        deliveryState: 'CA',
        "shipping[postal_zip_code]": "94103",
        deliveryCountry: 'US',
        countries: {},
        subdivisions: {},
        checkout: null,
        // state below is set after checkout token is generated
        "fulfillment[shipping_method]": '',
        shippingOptions: [],
        shippingOptionsById: {},
        cardNumber: '',
        expMonth: '01',
        expYear: '2021',
        cvc: '123',
        billingPostalZipcode: '94103',

        errors: {
          "fulfillment[shipping_method]": null,
          gateway_error: null,
          "customer[email]": null,
          "shipping[name]": null,
          "shipping[street]": null,
          "shipping[town_city]": null,
          "shipping[postal_zip_code]": null
        }
      },
      template: props => {
        const {
          line_items: lineItems = []
        } = props.cart || {};

        const allLineItems = lineItems.map((item, key) => {
          return (
            <CartLineItem
              removeProductFromCart={this.removeProductFromCart}
              item={item}
              key={key}
              updateQuantity={this.updateQuantity}
            />
          )
        })

        const allCountryOptions = Object.keys(this.state.countries).map((country, key) => {
          return (
            <option value={country} key={key}>
              { this.state.countries[country] }
            </option>
          )
        })

        const allSubdivisionsOptions = Object.keys(this.state.subdivisions).map((subdivision, key) => {
          return (
            <option value={subdivision} key={key}>
              { this.state.subdivisions[subdivision] }
            </option>
          )
        })

        const allShippingOptions = this.state.shippingOptions.map((option, key) => {
          return (
            <option value={option.id} key={key}>
              { `${option.description} - $${option.price.formatted_with_code}` }
            </option>
          )
        })

        return h('div', 'cart checkout page')
      }
    }
  }
}

export default CartCheckout;
