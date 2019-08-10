import setUpShadowAndRender from '../utils/setUpShadowAndRender'
import WithComponentState from '../utils/withComponentState';

class App extends WithComponentState() {

  constructor() {
    super();
    this.state = {
    }
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
