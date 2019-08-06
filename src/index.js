import './styles/application.scss';
import AppContainer from './components/App.js';
import Footer from './components/Footer.js';

// TODO: create util function to DRY up customElementsRegistry.define use
// register custom element 'app-container', with it's class AppContainer object defining
// it's behavior
customElements.define("app-container", AppContainer);

// register x-footer;Footer
customElements.define("x-footer", Footer)
