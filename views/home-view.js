class HomeView extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
      <section class="home-hero">
        <img 
          src="/img/logo.png" 
          alt="Vinyl Store Logo"
          class="home-logo"
        >

        <p class="home-slogan">
          Kultowe albumy. Analogowe brzmienie. Prawdziwe emocje.
        </p>

        <button class="home-cta" onclick="navigate('shop')">
          Przejdź do sklepu
        </button>
      </section>
    `;
    }
}

customElements.define('home-view', HomeView);
