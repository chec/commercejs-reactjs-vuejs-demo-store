import setUpShadowAndRender from '../utils/setUpShadowAndRender'

class App extends HTMLDivElement {

  constructor() {
    super();
  }

  connectedCallback(){
    setUpShadowAndRender.call(this, undefined, true)
  }

  render() {
    return `
      <x-header></x-header>
      <main id="main">

      </main>
      <x-footer></x-footer>
    `;
  }
}

export default App;
