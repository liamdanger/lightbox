const state = require('./state.js');

const search = require('./components/search.js');
const imageGrid = require('./components/image-grid.js');

// Set initial app state
state.set({
  LIGHTBOX_OPEN: false,
  IMAGE_SHOWING: 0,
  images: []
});

const main = document.createElement('main');
main.appendChild(search(state));
main.appendChild(imageGrid(state));

document.body.appendChild(main);
