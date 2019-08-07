import './styles/application.scss';
import App from './components/App.js';
import Footer from './components/Footer.js';
import Header from './components/Header.js';

// TODO: create util function to DRY up customElementsRegistry.define use

// register custom elements
customElements.define("app-container", App, { extends: 'div' });
customElements.define("x-footer", Footer);
customElements.define("x-header", Header);
