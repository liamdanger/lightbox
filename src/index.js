const state = require('./state.js');
const view = require('./views/main.js');

// Set initial app state
state.set({
  LIGHTBOX_OPEN: false,
  PHOTO_SHOWING: 0,
  photos: {}
});

// Temporarily exposing state for inspection
window.state = state;

document.body.appendChild(view(state));
