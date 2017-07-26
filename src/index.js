const state = require('./state.js');

// Set initial app state
state.set({
  LIGHTBOX_OPEN: false,
  PHOTO_SHOWING: 0,
  photos: [
    { title: "A Beautiful Elk" },
    { title: "Is that a Platypus? At this Latitude?" },
    { title: "Is that a Platypus? At this Latitude?" }
  ]
});

// Temporarily exposing state for inspection
window.state = state;

const photos = require('./components/photos.js');

const main = document.createElement('main');
main.appendChild(photos(state));

document.body.appendChild(main);
