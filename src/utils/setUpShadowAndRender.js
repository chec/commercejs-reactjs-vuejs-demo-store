export default function(shadowOptions = { mode: 'open' }, useLightDOM = false) {
  if (!(this instanceof HTMLElement)) {
    return;
  }
  if (useLightDOM) {
    this.innerHTML = this.render()
    return;
  }
  this.attachShadow(shadowOptions)
  this.shadowRoot.innerHTML = this.render()
}
