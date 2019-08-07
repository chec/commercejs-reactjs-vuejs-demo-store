import './styles/application.scss';
import App from './components/App.js';
import Footer from './components/Footer.js';
import Header from './components/Header.js';

// TODO: create util function to DRY up customElementsRegistry.define use
// register custom element 'app-container', with it's class AppContainer object defining
// it's behavior
customElements.define("app-container", App, { extends: 'div' });

// register x-footer;Footer
customElements.define("x-footer", Footer);

// register x-header;Header
customElements.define("x-header", Header);
