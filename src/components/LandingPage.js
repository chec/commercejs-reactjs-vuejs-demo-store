import setUpShadowAndRender from '../utils/setUpShadowAndRender';
import lettersHeroBg from '../assets/letters-hero-bg.svg';
import shoesHero from '../assets/shoes-hero.png';

class LandingPage extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback() {
    setUpShadowAndRender.call(this, undefined, true);
  }

  render() {
    return `
      <div class="w-100">
        <div class="absolute absolute-fill flex flex-column items-center">
          <img src=${shoesHero} width="100%" height="auto" />
        </div>
        <div class="w-100">
          <img src=${lettersHeroBg} width="100%" height="auto" />
        </div>
      </div>
    `
  }
}

export default LandingPage
