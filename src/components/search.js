const searchGifs = require('../giphy.js');
const { send, receive } = require('../events.js');

module.exports = (state) => {
  const el = document.createElement('div');

  el.innerHTML = render(state);
  bind(el, state);

  // If we have a query on load, submit it
  const { query } = state.current;
  if (query) { submitSearch(query, state); }

  return el;
}

function bind(el, state) {
  const form = el.querySelector('.search-form');

  form.addEventListener('submit', (e) => {
    submitSearch(getQuery(e), state)
  });
}

function render(state) {
  const { query } = state.current;

  return `
    <form class="search-form">
      <input value="${query}" placeholder="Search for GIFs!" class="search-form-field" id="search-form-q" name="q" type="search" />
      <button class="search-form-button" title="Search">🔍</button>
    </form>
  `;
}

function getQuery(e) {
  e.preventDefault();

  const input = document.getElementById('search-form-q');

  return input.value;
}

function submitSearch(query, state) {
  send('search:submit');

  state.set({ LOADING: true });

  searchGifs(query)
    .then((images) => {
      state.set({
        images,
        imageShowing: '',
        LOADING: false,
        LIGHTBOX_OPEN: false,
        query
      });

      history.pushState(state.current, `Search results for "${query}"`, `?q=${query}`);
    });
}

