export const state = {
    page: 'home',
    albums: [],
    filteredAlbums: [],
    selectedAlbum: null,
    cart: JSON.parse(localStorage.getItem('cart') || '[]'),
    theme: localStorage.getItem('theme') || 'light',
    sort: 'default',
};
