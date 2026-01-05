import { state } from '../state.js';

class CartView extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    increaseQty(i) {
        state.cart[i].quantity = (state.cart[i].quantity || 1) + 1;
        localStorage.setItem('cart', JSON.stringify(state.cart));
        this.render();
    }

    decreaseQty(i) {
        if ((state.cart[i].quantity || 1) > 1) state.cart[i].quantity -= 1;
        else this.removeFromCart(i);
        localStorage.setItem('cart', JSON.stringify(state.cart));
        this.render();
    }

    removeFromCart(i) {
        state.cart.splice(i, 1);
        localStorage.setItem('cart', JSON.stringify(state.cart));
        this.render();
    }

    goToCheckout() {
        navigate('checkout');
    }

    render() {
        const total = state.cart.reduce(
            (sum, a) => sum + (Number(a.price) || 0) * (a.quantity || 1),
            0
        );

        this.innerHTML = `
      <section style="padding:2rem">
        <h2>Koszyk</h2>
        <table class="cart-table">
          <thead>
            <tr>
              <th>Tytuł</th>
              <th>Artysta</th>
              <th>Cena za jedną</th>
              <th>Ilość</th>
              <th>Usuń</th>
            </tr>
          </thead>
          <tbody>
            ${state.cart
                .map(
                    (a, i) => `
              <tr>
                <td>${a.title}</td>
                <td>${a.artist}</td>
                <td>${Number(a.price)} zł</td>
                <td>
                  <div class="qty-buttons">
                    <button data-i="${i}" class="dec">-</button>
                    ${a.quantity || 1}
                    <button data-i="${i}" class="inc">+</button>
                  </div>
                </td>
                <td><button data-i="${i}" class="remove">Usuń</button></td>
              </tr>
            `
                )
                .join('')}
          </tbody>
        </table>

        <div class="cart-summary">Razem: ${total} zł</div>
        <button id="checkoutBtn">Złóż zamówienie</button>
      </section>
    `;

        // Eventy przycisków
        this.querySelectorAll('.qty-buttons .inc').forEach((btn) =>
            btn.addEventListener('click', (e) =>
                this.increaseQty(Number(e.target.dataset.i))
            )
        );
        this.querySelectorAll('.qty-buttons .dec').forEach((btn) =>
            btn.addEventListener('click', (e) =>
                this.decreaseQty(Number(e.target.dataset.i))
            )
        );
        this.querySelectorAll('.remove').forEach((btn) =>
            btn.addEventListener('click', (e) =>
                this.removeFromCart(Number(e.target.dataset.i))
            )
        );

        // Event przycisku przejścia do checkout
        this.querySelector('#checkoutBtn').addEventListener('click', () =>
            this.goToCheckout()
        );
    }
}

customElements.define('cart-view', CartView);
