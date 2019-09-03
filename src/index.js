import './styles/application.scss';
import App from './components/App';
import Footer from './components/Footer';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import ProductDetail from './components/ProductDetail';
import CartCheckout from './components/CartCheckout';
import ThankYou from './components/ThankYou';

// TODO: create util function to DRY up customElementsRegistry.define use

// register custom elements
customElements.define("app-container", App);
customElements.define("x-footer", Footer);
customElements.define("x-header", Header);
customElements.define("landing-page", LandingPage);
customElements.define("product-detail", ProductDetail);
customElements.define("cart-checkout", CartCheckout);
customElements.define("thank-you", ThankYou);
