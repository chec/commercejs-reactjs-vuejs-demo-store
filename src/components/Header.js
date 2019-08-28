import { Component, h } from 'panel';

import setUpShadowAndRender from '../utils/setUpShadowAndRender'
import WithComponentState from '../utils/withComponentState'
import parseProp from '../utils/unescapeAndParseAttribute';

// svg
import logo from '../assets/logo.svg';
import LogoSvg from '../assets/LogoSvg';
import cartIcon from '../assets/cart-icon.svg';
import pairShoes from '../assets/pair-shoes-small.png';

class Header extends Component {
  
  get config() {
    return {
      template: props => {
        return h('header', { attrs: { class: 'absolute w-100 ph5 pv5 flex flex-row justify-between mt3 z-1' }}, [
          h('div', { attrs: { class: 'logoContainer dim pointer'}}, LogoSvg()),
          h('div', { attrs: { class: 'flex'}}, [
            h('div', { attrs: { class: 'productFragmentContainer mw4'}}, [
              h('button', { attrs: { class: 'absolute right-0 medium-text f7 cherry bg-blossom ttu rotate-270 pv2 ph2 bg-white outline-0 dim pointer mr5 mt3', name: ''}}, [
                'pre-order now'
              ]),
              h('div', { attrs: { class: 'w-100'}}, [
                h('img', { attrs: { src: pairShoes, width: "100%", height: "auto" }})
              ])
            ]),
            h('div', { attrs: { class: 'flex flex-row items-center'}}, [
              h('div', { attrs: { class: 'cartIconContainer pointer'}}, [
                h('img', { attrs: { src: cartIcon, width: "100%", height: "100%"}})
              ]),
              h('p', { attrs: { class: "medium-text f7 white"}}, [props.cart ? props.cart.total_items : '0'])
            ])
          ])
        ])
      }
    }
  }
}

export default Header;
