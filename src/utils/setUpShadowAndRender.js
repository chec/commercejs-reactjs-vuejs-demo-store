export default function(shadowOptions = { mode: 'open' }) {
  if (!(this instanceof HTMLElement)) {
    return;
  }
  alert('all went well!')
  this.attachShadow(shadowOptions)
  this.shadowRoot.innerHTML = this.render()
}
