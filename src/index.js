const state = require('./state.js');

const Search = require('./components/search.js');
const ImageGrid = require('./components/image-grid.js');
const Lightbox = require('./components/lightbox.js');

// If there's a query already, set it to render
const query = decodeURI(window.location.search.replace('?q=', '').trim()) || '';

// Set initial app state
state.set({
  LOADING: false,
  LIGHTBOX_OPEN: false,
  imageShowing: '',
  query,
  images: []
});

const main = document.createElement('main');
main.appendChild(Search.el);
main.appendChild(ImageGrid.el);
main.appendChild(Lightbox.el);


document.body.appendChild(main);
