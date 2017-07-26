const state = require('./state.js');

const search = require('./components/search.js');
const photos = require('./components/photos.js');

// Set initial app state
state.set({
  LIGHTBOX_OPEN: false,
  PHOTO_SHOWING: 0,
  photos: []
});

// Temporarily exposing state for inspection
window.state = state;

const main = document.createElement('main');
main.appendChild(search(state));
main.appendChild(photos(state));

document.body.appendChild(main);
