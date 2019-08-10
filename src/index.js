import './styles/application.scss';
import App from './components/App';
import Footer from './components/Footer';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import ProductDetail from './components/ProductDetail';

// TODO: create util function to DRY up customElementsRegistry.define use

// register custom elements
customElements.define("app-container", App);
customElements.define("x-footer", Footer);
customElements.define("x-header", Header);
customElements.define("landing-page", LandingPage);
customElements.define("product-detail", ProductDetail;
