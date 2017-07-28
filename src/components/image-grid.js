const { send, receive, click } = require('../events.js');

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
  const { images, query } = state.current;

  const renderImages = (images) => (
    images.map((image) => (`
      <li tabindex="0" id="${image.id}" class="image-grid-item">
        <img src="${image.preview.url}" />
      </li>`)
    ).join('')
  );

  // Nothing searched yet
  if (query.length < 1 && images.length < 1) {
    return `
      <p class="image-grid-error">Search to see lots of wonderful GIFs!</p>
    `;
  // No results
  } else if (query.length < 1 && images.length > 0) {
    return `
      <p class="image-grid-error">No results found for "${query}".</p>
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
    click(image, (e) => {
      state.set({ 
        LIGHTBOX_OPEN: true, 
        imageShowing: image.id 
      });
    });
  });
}
