import { state } from '../state.js';

class CheckoutView extends HTMLElement {
    payment = null;
    delivery = null;

    connectedCallback() {
        this.render();
    }

    selectPayment(method) {
        this.payment = method;
        this.render();
    }

    selectDelivery(method) {
        this.delivery = method;
        this.render();
    }

    submitOrder() {
        if (!this.payment || !this.delivery) {
            alert('Wybierz metodę płatności i dostawy!');
            return;
        }

        state.cart = [];
        localStorage.removeItem('cart');
        alert('Dziękujemy za zamówienie!');
        navigate('home');
    }

    render() {
        const total = state.cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        this.innerHTML = `
      <section style="padding:2rem; max-width:600px; margin:auto">
        <h2>Zamówienie</h2>

        <h3>Płatność</h3>
        <div class="checkout-row" id="paymentRow">
          <button class="checkout-btn ${
              this.payment === 'Karta' ? 'checked' : ''
          }" 
            data-method="Karta">💳 Karta</button>
          <button class="checkout-btn ${
              this.payment === 'BLIK' ? 'checked' : ''
          }" 
            data-method="BLIK">📱 BLIK</button>
          <button class="checkout-btn ${
              this.payment === 'Przelew' ? 'checked' : ''
          }" 
            data-method="Przelew">🏦 Przelew</button>
        </div>

        <h3 style="margin-top:1.5rem">Dostawa</h3>
        <div class="checkout-row" id="deliveryRow">
          <button class="checkout-btn ${
              this.delivery === 'Kurier' ? 'checked' : ''
          }" 
            data-method="Kurier">🚚 Kurier</button>
          <button class="checkout-btn ${
              this.delivery === 'Paczkomat' ? 'checked' : ''
          }" 
            data-method="Paczkomat">📦 Paczkomat</button>
          <button class="checkout-btn ${
              this.delivery === 'Odbiór osobisty' ? 'checked' : ''
          }" 
            data-method="Odbiór osobisty">🏬 Odbiór osobisty</button>
        </div>

        <h3 style="margin-top:2rem">Razem: ${total} zł</h3>

        <button class="checkout-submit">Złóż zamówienie</button>
      </section>
    `;

        // Podłącz eventy
        this.querySelectorAll('#paymentRow .checkout-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                this.selectPayment(e.target.dataset.method);
            });
        });

        this.querySelectorAll('#deliveryRow .checkout-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                this.selectDelivery(e.target.dataset.method);
            });
        });

        this.querySelector('.checkout-submit').addEventListener('click', () =>
            this.submitOrder()
        );
    }
}

customElements.define('checkout-view', CheckoutView);
