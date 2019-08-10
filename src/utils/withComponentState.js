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
      this.state = value
      this.innerHTML = this.render()
    }
    setState(state) {
      this.componentState = state
    }
  }
}
