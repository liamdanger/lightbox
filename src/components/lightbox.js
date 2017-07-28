const { send, receive, click } = require('../events.js');

module.exports = (state) => {
  const el = document.createElement('div');
  const props = ['LIGHTBOX_OPEN', 'imageShowing'];

  receive('state:change', () => {
    if (state.changed(props)) {
      el.innerHTML = render(state);
      bind(el, state);
    }
  });

  return el;
}

function render(state) {
  const { images, imageShowing, LIGHTBOX_OPEN } = state.current;

  const renderImage = (image) => (`
    <img class="lightbox-image" src="${image.original.url}" />
  `);

  return `
    <div class="lightbox" ${LIGHTBOX_OPEN ? '' : 'hidden'}>
      ${imageShowing ? renderImage(getCurrentImage(images, imageShowing)) : ''}
      <button title="Next" class="circle-button lightbox-button lightbox-next">🔜</button>
      <button title="Previous" class="circle-button lightbox-button lightbox-prev">🔙</button>
      <button title="Close" class="circle-button lightbox-button lightbox-close">❌</button>
    </div>
    <div class="lightbox-mask" ${LIGHTBOX_OPEN ? '' : 'hidden'} />
  `;
}

function bind(el, state) {
  const { images, imageShowing } = state.current;

  const close = el.querySelector('.lightbox-close');
  const mask = el.querySelector('.lightbox-mask');
  const next = el.querySelector('.lightbox-next');
  const prev = el.querySelector('.lightbox-prev');

  click( close, () => state.set({ LIGHTBOX_OPEN: false }) );
  click( mask,  () => state.set({ LIGHTBOX_OPEN: false }) );
  click( next,  () => advanceImage(1) );
  click( prev,  () => advanceImage(-1) );

  function advanceImage(direction) {
    state.set({
      imageShowing: getSiblingImage(images, imageShowing, direction).id 
    });
  }
}

function getSiblingImage(images, imageShowing, delta) {
  const image = getCurrentImage(images, imageShowing);
  let position = images.indexOf(image) + delta;

  if (position >= images.length) { position = 0 }
  if (position <= -1) { position = images.length - 1 }

  return images[position];
}

function getCurrentImage(images, imageShowing) {
  return images.find((image) => image.id == imageShowing);
}
