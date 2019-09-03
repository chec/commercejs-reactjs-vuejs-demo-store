import { Component, h } from 'panel';
import pairShoes from '../assets/pair-shoes-small.png'

class ThankYou extends Component {
  constructor() {
    super()
  }

  get config() {
    return {
     template: function(state) {
        const allLineItems = state.props.order && state.props.order.order.line_items.map((item, key) => {
          debugger;
         return h('div', {
            attrs: {
              class: 'flex flex-row justify-between items-center ph4 pv2'
            }
          },
          [
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
              }, '')
            ]),
            h('p', { attrs: { class: 'medium-text f6 white tr ttu mw4'}}, [
              item.product_name,
              h('span', { attrs: { class: "db f7 pv1"}}, [
                item.variants[0].option_name
              ]),
              h('span', { attrs: { class: "db f7"}}, [
                h('span', { attrs: { class: "ttl"}}, [
                  'x'
                ]),
                `${item.quantity} - ${item.line_total.formatted_with_code}`
              ])
            ])
          ])
        });

        return state.props.order ? h('div', {
          attrs: {
            class: 'flex flex-grow-1 bg-tan-white w-100 pt6 pb5'
          }
        }, [
          h('div', {
            attrs: {
              class: 'cf flex flex-column flex-row-l mw9 center w-100 ph3 mt6'
            }
          }, [
            h('div', {
              attrs: {
                class: 'fl w-100 w-40-l ph3'
              }
            }, [
              h('div', {
                attrs: {
                  class: 'relative z-1 h5 br3 bg-dark-gray w-100 shadow-3 pt2 overflow-scroll'
                }
              },
                allLineItems
              ),
              h('div', {
                attrs: {
                  class: 'pt4 pb3 nt3 br3 ph4 bg-cherry'
                }
              }, [
                h('div', {
                  attrs: {
                    class: 'flex pb1 justify-between items-center w-100 medium-text f6 white ttu b tracked-mega-1'
                  }
                }, [
                  h('p', [
                    'total'
                  ]),
                  h('p', {
                    attrs: {
                      class: 'tr'
                    }
                  }, [
                    this.state.props.order.order.total.formatted_with_code
                  ])
                ])
              ])
            ]),
            h('div', {
              attrs: {
                class: 'fl w-100 w-60-l ph3 mt4 mt0-l'
              }
            }, [
              h('div', { attrs: { class: 'flex flex-column items-center justify-center' } }, [
                h('p', {
                  attrs: {
                    class: 'large-title-text dark-gray tc tracked'
                  }
                }, [
                  'Thank you for your order!'
                ]),
                h('div', {
                  attrs: {
                    class: 'w-100 flex items-center mt4'
                  }
                }, [
                  h('p', {
                    attrs: {
                      class: 'flex-grow-1 medium-text f6 cherry ttu tracked tl br b--moon-gray pr3 pv4 lh-title'
                    }
                  }, [
                    `a full receipt will be emailed to ${this.state.props.order.customer.email}.`
                  ]),
                  h('div', {
                    attrs: {
                      class: 'flex flex-column pl5'
                    }
                  }, [
                    h('p', {
                      attrs: {
                        class: 'medium-text f6 black ttu tracked tr mb3'
                      }
                    }, [
                      'your details',
                      h('span', { attrs: { class: 'db pt1 f7 mid-gray'}}, [
                        this.state.props.order.customer.email
                      ])
                    ]),
                    h('p', {
                      attrs: {
                        class: 'medium-text f6 black ttu tracked tr'
                      }
                    }, [
                      'delivery address',
                      h('span', {
                        attrs: {
                          class: 'db pt1 f7 mid-gray'
                        }
                      }, [
                        this.state.props.order.shipping.name
                      ]),
                      h('span', {
                        attrs: {
                          class: 'db pt1 f7 mid-gray'
                        }
                      }, [
                        this.state.props.order.shipping.street
                      ]),
                      h('span', {
                        attrs: {
                          class: 'db pt1 f7 mid-gray'
                        }
                      }, [
                        this.state.props.order.shipping.town_city
                      ]),
                      h('span', {
                        attrs: {
                          class: 'db pt1 f7 mid-gray'
                        }
                      }, [
                        `${this.state.props.order.shipping.county_state}, ${this.state.props.order.shipping.postal_zip_code}`
                      ]),
                      h('span', {
                        attrs: {
                          class: 'db pt1 f7 mid-gray'
                        }
                      }, [
                        this.state.props.order.shipping.country
                      ]),
                    ])
                  ])
                ]),
              ])
            ])
          ])
        ]) : h('p', {}, ['loading'])
      }.bind(this)
    }
  }
}
export default ThankYou;
