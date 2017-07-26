const { send, receive } = require('../events.js');

module.exports = (state) => {
  const el = document.createElement('div');
  const props = ['LIGHTBOX_OPEN', 'IMAGE_SHOWING'];

  receive('state:change', () => {
    if (state.changed(props)) {
      el.innerHTML = render(state);
      bind(el, state);
    }
  });

  return el;
}

function render(state) {
  const { images, IMAGE_SHOWING, LIGHTBOX_OPEN } = state.current;

  const renderImage = (image) => (`
    <img class="lightbox-image" src="${image.original.url}" />
  `);

  return `
    <div class="lightbox" ${LIGHTBOX_OPEN ? '' : 'hidden'}>
      ${IMAGE_SHOWING ? renderImage(getCurrentImage(images, IMAGE_SHOWING)) : ''}
      <button class="lightbox-close">❌</button>
      <button class="lightbox-prev">🔙</button>
      <button class="lightbox-next">🔜</button>
    </div>
  `;
}

function bind(el, state) {
  const close = el.querySelector('.lightbox-close');
  close.addEventListener('click', (e) => {
    state.set({ LIGHTBOX_OPEN: false });
  });
}

function getCurrentImage(images, IMAGE_SHOWING) {
  return images.find((image) => image.id == IMAGE_SHOWING);
}
