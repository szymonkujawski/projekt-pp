import { state } from '../state.js';

class AppHeader extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        const total = state.cart.reduce((s, a) => s + a.quantity, 0);
        this.innerHTML = `
      <header>
        <strong>VINYL STORE</strong>
        <nav>
          <a onclick="navigate('home')">Home</a>
          <a onclick="navigate('shop')">Sklep</a>
          <a onclick="navigate('cart')">Koszyk (${total})</a>
        </nav>
        <button class="secondary" onclick="toggleTheme()">🌓</button>
      </header>
    `;
    }
}

customElements.define('app-header', AppHeader);
