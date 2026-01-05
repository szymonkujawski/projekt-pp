import '../components/app-header.js';
import '../views/home-view.js';
import '../views/shop-view.js';
import '../views/product-view.js';
import '../views/cart-view.js';
import '../views/checkout-view.js';
import { state } from '../state.js';

class AppRoot extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
      <app-header></app-header>
      <main id="router-view"></main>
    `;
        this.renderView();
    }

    renderView() {
        const view = this.querySelector('#router-view');
        view.innerHTML = `<${state.page}-view></${state.page}-view>`;
    }
}

customElements.define('app-root', AppRoot);
