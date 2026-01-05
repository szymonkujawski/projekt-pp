const ARTISTS = ['Michael Jackson', 'Sade', 'Phil Collins', 'Lionel Richie'];

const state = {
    page: 'home',
    albums: [],
    filteredAlbums: [],
    selectedAlbum: null,
    cart: JSON.parse(localStorage.getItem('cart') || '[]'),
    theme: localStorage.getItem('theme') || 'light',
};

document.documentElement.dataset.theme = state.theme;

/* ROOT */
class AppRoot extends HTMLElement {
    connectedCallback() {
        this.render();
    }
    render() {
        const totalQty = state.cart.reduce((s, a) => s + a.quantity, 0);
        this.innerHTML = `
      <header>
        <strong>VINYL STORE</strong>
        <nav>
          <a onclick="navigate('home')">Home</a>
          <a onclick="navigate('shop')">Sklep</a>
          <a onclick="navigate('cart')">Koszyk (${totalQty})</a>
        </nav>
        <button class="secondary" onclick="toggleTheme()">🌓</button>
      </header>
      <main id="view"></main>
    `;
        renderView();
    }
}
customElements.define('app-root', AppRoot);

/* NAVIGATION */
window.navigate = (page, albumId = null) => {
    state.page = page;
    if (albumId) {
        state.selectedAlbum = state.albums.find(
            (a) => a.collectionId === albumId
        );
    }
    document.querySelector('app-root').render();
};

window.toggleTheme = () => {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = state.theme;
    localStorage.setItem('theme', state.theme);
};

/* VIEWS */
function renderView() {
    const view = document.getElementById('view');

    if (state.page === 'home') {
        view.innerHTML = `
      <section style="padding:4rem;text-align:center">
        <h1>Sklep z winylami</h1>
        <button onclick="navigate('shop')">Przejdź do sklepu</button>
      </section>`;
    }

    if (state.page === 'shop') {
        view.innerHTML = `
      <div class="search-bar">
        <input id="searchInput" placeholder="Szukaj po artyście lub tytule">
        <button onclick="searchAlbums()">Szukaj</button>
      </div>
      <p style="text-align:center">Ładowanie albumów...</p>`;
        loadAlbums();
    }

    if (state.page === 'product') {
        loadAlbumDetails(state.selectedAlbum);
    }

    if (state.page === 'cart') {
        const total = state.cart.reduce((s, a) => s + a.price * a.quantity, 0);
        view.innerHTML = `
      <section style="padding:2rem">
        <h2>Koszyk</h2>
        ${state.cart
            .map(
                (a, i) => `
          <div class="cart-item">
            <span>${a.title}</span>
            <span>${a.price} zł</span>
            <div class="qty-buttons">
              <button onclick="decreaseQty(${i})">-</button>
              <span>${a.quantity}</span>
              <button onclick="increaseQty(${i})">+</button>
            </div>
            <button onclick="removeFromCart(${i})">Usuń</button>
          </div>`
            )
            .join('')}
        <h3>Razem: ${total} zł</h3>
        <button onclick="navigate('checkout')">Zamów</button>
      </section>`;
    }

    if (state.page === 'checkout') {
        view.innerHTML = `
      <section style="padding:2rem">
        <h2>Zamówienie</h2>
        <div class="checkout-option">Karta</div>
        <div class="checkout-option">BLIK</div>
        <button onclick="finishOrder()">Złóż zamówienie</button>
      </section>`;
    }
}

/* LOAD ALBUMS */
async function loadAlbums() {
    if (state.albums.length) return renderAlbums();

    const responses = await Promise.all(
        ARTISTS.map((a) =>
            fetch(
                `https://itunes.apple.com/search?term=${encodeURIComponent(
                    a
                )}&entity=album&limit=10`
            ).then((r) => r.json())
        )
    );

    state.albums = responses.flatMap((r) =>
        r.results.map((a) => ({
            collectionId: a.collectionId,
            title: a.collectionName,
            artist: a.artistName,
            cover: a.artworkUrl100.replace('100x100', '300x300'),
            price: Math.floor(Math.random() * 40 + 80),
        }))
    );

    state.filteredAlbums = [...state.albums];
    renderAlbums();
}

/* SEARCH */
window.searchAlbums = () => {
    const q = document.getElementById('searchInput').value.toLowerCase();
    state.filteredAlbums = state.albums.filter(
        (a) =>
            a.title.toLowerCase().includes(q) ||
            a.artist.toLowerCase().includes(q)
    );
    renderAlbums();
};

/* RENDER GRID */
function renderAlbums() {
    const view = document.getElementById('view');
    view.innerHTML = `
    <div class="search-bar">
      <input id="searchInput" placeholder="Szukaj po artyście lub tytule">
      <button onclick="searchAlbums()">Szukaj</button>
    </div>
    <div class="grid">
      ${state.filteredAlbums
          .map(
              (a) => `
        <div class="album" onclick="navigate('product', ${a.collectionId})">
          <img src="${a.cover}">
          <strong>${a.title}</strong>
          <small>${a.artist}</small>
          <strong>${a.price} zł</strong>
        </div>`
          )
          .join('')}
    </div>`;
}

/* PRODUCT */
async function loadAlbumDetails(album) {
    const res = await fetch(
        `https://itunes.apple.com/lookup?id=${album.collectionId}&entity=song`
    );
    const data = await res.json();

    album.tracks = data.results.slice(1).map((t) => t.trackName);

    document.getElementById('view').innerHTML = `
    <div class="product">
      <img src="${album.cover}">
      <div>
        <h2>${album.title}</h2>
        <p>${album.artist}</p>
        <h3>${album.price} zł</h3>
        <button onclick="addToCart(${
            album.collectionId
        })">Dodaj do koszyka</button>
        <ol class="tracklist">
          ${album.tracks.map((t) => `<li>${t}</li>`).join('')}
        </ol>
      </div>
    </div>`;
}

/* CART */
window.addToCart = (id) => {
    const album = state.albums.find((a) => a.collectionId === id);
    const item = state.cart.find((a) => a.collectionId === id);
    if (item) item.quantity++;
    else state.cart.push({ ...album, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(state.cart));
    document.querySelector('app-root').render();
};

window.increaseQty = (i) => {
    state.cart[i].quantity++;
    localStorage.setItem('cart', JSON.stringify(state.cart));
    document.querySelector('app-root').render();
};

window.decreaseQty = (i) => {
    if (--state.cart[i].quantity <= 0) state.cart.splice(i, 1);
    localStorage.setItem('cart', JSON.stringify(state.cart));
    document.querySelector('app-root').render();
};

window.removeFromCart = (i) => {
    state.cart.splice(i, 1);
    localStorage.setItem('cart', JSON.stringify(state.cart));
    document.querySelector('app-root').render();
};

window.finishOrder = () => {
    alert('Dziękujemy za zakupy!');
    state.cart = [];
    localStorage.removeItem('cart');
    navigate('home');
};
