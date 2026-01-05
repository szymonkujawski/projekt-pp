import { state } from '../state.js';
import { fetchAlbums } from '../api.js';

class ShopView extends HTMLElement {
    constructor() {
        super();
        this.sortKey = 'default';
    }

    async connectedCallback() {
        if (!state.albums.length) {
            state.albums = await fetchAlbums();
            state.filteredAlbums = [...state.albums];
        }
        this.render();
    }

    filterAlbums() {
        const query = this.querySelector('#searchInput').value.toLowerCase();
        state.filteredAlbums = state.albums.filter(
            (a) =>
                a.title.toLowerCase().includes(query) ||
                a.artist.toLowerCase().includes(query)
        );
        this.applySort(); // sortujemy przefiltrowane
        this.renderGrid();
    }

    applySort() {
        const sortKey = this.querySelector('#sortSelect').value;
        this.sortKey = sortKey;
        const a = state.filteredAlbums;
        switch (sortKey) {
            case 'az':
                a.sort((x, y) => x.title.localeCompare(y.title));
                break;
            case 'za':
                a.sort((x, y) => y.title.localeCompare(x.title));
                break;
            case 'priceAsc':
                a.sort((x, y) => x.price - y.price);
                break;
            case 'priceDesc':
                a.sort((x, y) => y.price - x.price);
                break;
            case 'yearAsc':
                a.sort((x, y) => x.year - y.year);
                break;
            case 'yearDesc':
                a.sort((x, y) => y.year - x.year);
                break;
        }
    }

    renderGrid() {
        const container = this.querySelector('.albums-container');
        container.innerHTML = `
      <div class="grid">
        ${state.filteredAlbums
            .map(
                (a) => `
        <div class="album" onclick="navigate('product', ${a.collectionId})">
          <img src="${a.cover}">
          <strong>${a.title}</strong>
          <small>${a.artist} (${a.year})</small>
          <strong>${a.price} zł</strong>
        </div>
      `
            )
            .join('')}
      </div>
    `;
    }

    render() {
        this.innerHTML = `
      <div class="search-sort">
  <input type="text" placeholder="Szukaj po tytule lub artyście..." id="searchInput">
  <button id="searchBtn">Szukaj</button>
  <select id="sortSelect">
    <option value="default">Sortowanie</option>
    <option value="az">A → Z</option>
    <option value="za">Z → A</option>
    <option value="priceAsc">Cena ↑</option>
    <option value="priceDesc">Cena ↓</option>
    <option value="yearAsc">Rok ↑</option>
    <option value="yearDesc">Rok ↓</option>
  </select>
</div>
<div class="albums-container" style="padding:0 2rem"></div>
    `;

        // eventy
        this.querySelector('#searchBtn').addEventListener('click', () =>
            this.filterAlbums()
        );

        this.querySelector('#sortSelect').addEventListener('change', () => {
            this.applySort();
            this.renderGrid();
        });

        this.renderGrid();
    }
}

customElements.define('shop-view', ShopView);
