export default function _WithComponentState(SuperClass = class extends HTMLElement {}) {
  return class Component extends SuperClass {
    constructor() {
      super()
      this.state = {}
    }
    get componentState() {
      return this.state;
    }
    set componentState(value) {
      console.log('*** Updating State ***')
      console.log('*** Current State ***', this.state)
      console.log('*** Argument Value ***', value)
      this.state = value
      this.innerHTML = this.render()
      console.log('*** New State ***', this.state)
      console.log('*** -------------- ***')

    }
    setState(state) {
      this.componentState = state
    }
  }
}
