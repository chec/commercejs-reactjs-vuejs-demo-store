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
      <div class="relative w-100 mw9 center ph2">
        <div class="absolute absolute--fill flex flex-column items-center">
          <img src=${shoesHero} width="100%" height="auto" />
        </div>
        <div class="absolute absolute--fill flex flex-column justify-center items-center nb7 ph3">
          <p class="flex flex-shrink-1 flex-column hero-text white tr">
            LOREM IPSUM LOREM IPSUM
            <button class="medium-text f7 cherry bg-blossom ttu pv3 ph3 bg-white outline-0 dim pointer mw4 self-end mr3">
              shop shoe
            </button>
          </p>
        </div>
        <div class="w-100">
          <img src=${lettersHeroBg} width="100%" height="auto" />
        </div>
      </div>
    `
  }
}

export default LandingPage
