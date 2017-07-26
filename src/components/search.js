const { send, receive } = require('../events.js');

module.exports = (state) => {
  const el = document.createElement('div');

  el.id = "search";
  el.innerHTML = render();

  const form = el.getElementsByClassName('search-form')[0];
  form.onsubmit = submitSearch;

  return el;
}

function submitSearch(e) {
  e.preventDefault();

  console.log(this);
}

function render() {
  return `
    <form class="search-form">
      <input name="q" type="search" />
      <button>🔍</button>
    </form>
  `;
}

