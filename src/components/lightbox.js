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
      <button title="Next" class="circle-button lightbox-button lightbox-next">🔜</button>
      <button title="Previous" class="circle-button lightbox-button lightbox-prev">🔙</button>
      <button title="Close" class="circle-button lightbox-button lightbox-close">❌</button>
    </div>
    <div class="lightbox-mask" ${LIGHTBOX_OPEN ? '' : 'hidden'} />
  `;
}

function bind(el, state) {
  const { images, IMAGE_SHOWING } = state.current;

  const close = el.querySelector('.lightbox-close');
  close.addEventListener('click', (e) => {
    state.set({ LIGHTBOX_OPEN: false });
  });

  const next = el.querySelector('.lightbox-next');
  next.addEventListener('click', (e) => advanceImage(1) );

  const prev = el.querySelector('.lightbox-prev');
  prev.addEventListener('click', (e) => advanceImage(-1) );

  function advanceImage(direction) {
    state.set({
      IMAGE_SHOWING: getSiblingImage(images, IMAGE_SHOWING, direction).id 
    });
  }
}

function getSiblingImage(images, IMAGE_SHOWING, delta) {
  const image = getCurrentImage(images, IMAGE_SHOWING);
  let position = images.indexOf(image) + delta;

  if (position >= images.length) { position = 0 }
  if (position <= -1) { position = images.length - 1 }

  return images[position];
}

function getCurrentImage(images, IMAGE_SHOWING) {
  return images.find((image) => image.id == IMAGE_SHOWING);
}
