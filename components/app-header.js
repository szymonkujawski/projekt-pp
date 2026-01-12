import { state } from '../state.js';

class AppHeader extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        const total = state.cart.reduce((s, a) => s + a.quantity, 0);

        this.innerHTML = `
      <header>
        <div class="header-left">
          <img 
            src="/img/logo.png" 
            alt="Vinyl Store"
            class="header-logo"
            onclick="navigate('home')"
          >
        </div>

        <nav class="header-nav">
          <a onclick="navigate('home')">Home</a>
          <a onclick="navigate('shop')">Sklep</a>
          <a onclick="navigate('cart')">Koszyk (${total})</a>
        </nav>

        <div class="header-right">
          <button class="secondary" onclick="toggleTheme()">🌓</button>
        </div>
      </header>
    `;
    }
}

customElements.define('app-header', AppHeader);
