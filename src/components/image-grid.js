const { send, receive } = require('../events.js');

module.exports = (state) => {
  const el = document.createElement('div');
  const props = ["images"];

  receive('state:change', () => {
    if (state.changed(props)) {
      el.innerHTML = render(state);
      bind(el, state);
    }
  });

  return el;
}

function render(state) {
  const { images, QUERY } = state.current;

  const renderImages = (images) => (
    images.map((image) => (`
      <li tabindex="0" id="${image.id}" class="image-grid-item">
        <img src="${image.preview.url}" />
      </li>`)
    ).join('')
  );

  // Nothing searched yet
  if (!QUERY.length && !images.length) {
    return `
      <p class="image-grid-error">Search to see lots of wonderful GIFs!</p>
    `;
  // No results
  } else if (QUERY.length && !images.length) {
    return `
      <p class="image-grid-error">No results found for "${QUERY}".</p>
    `;
  // Displaying results
  } else {
    return `
      <ul class="image-grid">
        ${renderImages(images)}
      </ul>
    `;
  }
}

function bind(el, state) {
  const images = el.querySelectorAll('.image-grid-item');

  images.forEach((image) => {
    image.addEventListener('click', (e) => {
      state.set({ 
        LIGHTBOX_OPEN: true, 
        IMAGE_SHOWING: image.id 
      });
    });
  });
}
