const state = require('./state.js');
window.state = state;

const search = require('./components/search.js');
const imageGrid = require('./components/image-grid.js');
const lightbox = require('./components/lightbox.js');

const query = window.location.search.replace('?q=', '') || '';

// Set initial app state
state.set({
  LOADING: false,
  LIGHTBOX_OPEN: false,
  imageShowing: '',
  query: decodeURI(query.trim()),
  images: []
});

const main = document.createElement('main');
main.appendChild(search(state));
main.appendChild(imageGrid(state));
main.appendChild(lightbox(state));

document.body.appendChild(main);
