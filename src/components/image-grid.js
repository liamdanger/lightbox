const { send, receive } = require('../events.js');

module.exports = (state) => {
  const el = document.createElement('div');
  const props = ["images"];

  el.innerHTML = render(state);
  bind(el, state);

  receive('state:change', () => {
    if (state.changed(props)) {
      el.innerHTML = render(state);
      bind(el, state);
    }
  });

  return el;
}

function render(state) {
  const renderImages = (images) => (
    images.map((image) => (`
      <li id="${image.id}" class="image-grid-item">
        <img src="${image.preview.url}" />
      </li>`)
    ).join('')
  );

  return `
    <ul class="image-grid">
      ${renderImages(state.current.images)}
    </ul>
  `;
}

function bind(el, state) {
  const images = el.querySelectorAll('.image-grid-item');

  images.forEach((image) => {
    image.addEventListener('click', (e) => {
      state.set({ LIGHTBOX_OPEN: true, IMAGE_SHOWING: image.id });
    });
  });
}
