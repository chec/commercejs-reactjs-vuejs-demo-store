export default function(attributeName) {
  if (!(this instanceof HTMLElement)) {
    return;
  }
  return JSON.parse(unescape(this.getAttribute(attributeName)))
}
