import setUpShadowAndRender from '../utils/setUpShadowAndRender'

class Footer extends HTMLElement {

  constructor() {
    super()
  }

  connectedCallback() {
    setUpShadowAndRender.call(this, undefined, true)
  }

  render() {
    return `
      <footer class="footer flex pa4">
        <div class="self-end w-100">
          <p class="medium-text tr cherry">
            © 2019 CHEC PLATFORM/COMMERCEJS
          </p>
        </div>
      </footer>
    `;
  }
}

export default Footer;
