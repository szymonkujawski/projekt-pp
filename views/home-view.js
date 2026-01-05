class HomeView extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
      <section style="padding:4rem;text-align:center">
        <h1>Sklep z winylami</h1>
        <button onclick="navigate('shop')">Przejdź do sklepu</button>
      </section>
    `;
    }
}
customElements.define('home-view', HomeView);
