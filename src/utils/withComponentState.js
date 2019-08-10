export default function (SuperClass) {
  return class MixedComponent extends SuperClass {
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
