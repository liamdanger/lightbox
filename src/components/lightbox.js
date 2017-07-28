const Component = require('../component.js');
const state = require('../state.js');
const { click } = require('../events.js');

const Lightbox = new Component(state, ['LIGHTBOX_OPEN', 'imageShowing']);

Lightbox.render = function(state) {
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

Lightbox.bind = function(state) {
  const { images, imageShowing } = state.current;

  const close = this.el.querySelector('.lightbox-close');
  const mask = this.el.querySelector('.lightbox-mask');
  const next = this.el.querySelector('.lightbox-next');
  const prev = this.el.querySelector('.lightbox-prev');

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

module.exports = Lightbox;
