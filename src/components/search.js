const searchGifs = require('../giphy.js');
const { send, receive } = require('../events.js');

module.exports = (state) => {
  const el = document.createElement('div');

  el.innerHTML = render();
  bind(el, state);

  return el;
}

function bind(el, state) {
  const form = el.querySelector('.search-form');

  form.addEventListener('submit', (e) => {
    submitSearch(e, state)
  });
}

function render() {
  return `
    <form class="search-form">
      <input placeholder="Search for GIFs!" class="search-form-field" id="search-form-q" name="q" type="search" />
      <button class="search-form-button" title="Search">🔍</button>
    </form>
  `;
}

function submitSearch(e, state) {
  e.preventDefault();

  const input = document.getElementById('search-form-q');
  const query = input.value;

  // Clear field on successful search
  input.value = "";

  send('search:submit');

  searchGifs(query)
    .then((images) => {
      state.set({
        images,
        IMAGE_SHOWING: '',
        LIGHTBOX_OPEN: false 
      });
    });
}
