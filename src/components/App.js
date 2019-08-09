import setUpShadowAndRender from '../utils/setUpShadowAndRender'

class App extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback(){
    setUpShadowAndRender.call(this, undefined, true)
  }

  render() {
    return `
      <x-header></x-header>
      <main id="main" class="flex">
        <landing-page class="flex flex-grow-1 items-center"></landing-page>
      </main>
      <x-footer></x-footer>
    `;
  }
}

export default App;
