import './index.scss';

// we use the '#root' selector to query the document for an element with an id of root
const rootEl = document.querySelector('#root')

// do something with rootEl once DOMContentLoaded event is emitted
document.addEventListener("DOMContentLoaded", function(event) {
  alert("application loaded")
})
