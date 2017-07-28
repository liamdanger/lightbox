const Component = require('../component.js');
const state = require('../state.js');
const { send, submit } = require('../events.js');
const searchGifs = require('../giphy.js');

const Search = new Component(state, ['LOADING']);

Search.bind = function(state) {
  const form = this.el.querySelector('.search-form');

  submit(form, (e) => submitSearch(getQuery(e), state) );
}

Search.render = function(state) {
  const { query, LOADING } = state.current;

  if (this.first && query) { submitSearch(query, state); }

  return `
    <form class="search-form">
      <input ${LOADING ? 'disabled' : ''} value="${query}" placeholder="Search for GIFs!" class="search-form-field" id="search-form-q" name="q" type="search" />
      <button ${LOADING ? 'disabled' : ''} class="search-form-button" title="Search">🔍</button>
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

module.exports = Search;
