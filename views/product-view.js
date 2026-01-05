import { state } from '../state.js';
import { fetchAlbumDetails } from '../api.js';

class ProductView extends HTMLElement {
    async connectedCallback() {
        const tracks = await fetchAlbumDetails(
            state.selectedAlbum.collectionId
        );
        this.render(tracks);
    }

    render(tracks) {
        const a = state.selectedAlbum;
        this.innerHTML = `
      <div class="product">
        <img src="${a.cover}">
        <div>
          <h2>${a.title}</h2>
          <p>${a.artist}</p>
          <h3>${a.price} zł</h3>
          <button onclick="addToCart(${
              a.collectionId
          })">Dodaj do koszyka</button>
          <ol class="tracklist">
            ${tracks.map((t) => `<li>${t}</li>`).join('')}
          </ol>
        </div>
      </div>
    `;
    }
}

customElements.define('product-view', ProductView);
