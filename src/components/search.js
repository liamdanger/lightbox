const searchGifs = require('../giphy.js');
const { send, receive } = require('../events.js');

module.exports = (state) => {
  const el = document.createElement('div');

  el.id = "search";
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
      <input id="search-form-q" name="q" type="search" />
      <button>🔍</button>
    </form>
  `;
}

function submitSearch(e, state) {
  e.preventDefault();

  const input = document.getElementById('search-form-q');
  const query = input.value;

  // Clear field on successful search
  input.value = "";

  searchGifs(query)
    .then((images) => {
      state.set({images});
    })
}
