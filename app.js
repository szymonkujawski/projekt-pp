import './components/app-root.js';
import { state } from './state.js';

document.documentElement.dataset.theme = state.theme;

window.navigate = (page, id = null) => {
    state.page = page;
    if (id)
        state.selectedAlbum = state.albums.find((a) => a.collectionId === id);
    document.querySelector('app-root').render();
};

window.toggleTheme = () => {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = state.theme;
    localStorage.setItem('theme', state.theme);
};

window.addToCart = (id) => {
    const a = state.albums.find((a) => a.collectionId === id);
    const item = state.cart.find((i) => i.collectionId === id);
    item ? item.quantity++ : state.cart.push({ ...a, quantity: 1 });
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

window.changeSort = (value) => {
    const a = state.filteredAlbums;
    if (value === 'az') a.sort((x, y) => x.title.localeCompare(y.title));
    if (value === 'za') a.sort((x, y) => y.title.localeCompare(x.title));
    if (value === 'priceAsc') a.sort((x, y) => x.price - y.price);
    if (value === 'priceDesc') a.sort((x, y) => y.price - x.price);
    if (value === 'yearAsc') a.sort((x, y) => x.year - y.year);
    if (value === 'yearDesc') a.sort((x, y) => y.year - x.year);
    document.querySelector('shop-view')?.render();
};
