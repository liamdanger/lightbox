const { send, receive } = require('../events.js');

module.exports = (state) => {
  const el = document.createElement('div');
  const props = ['LIGHTBOX_OPEN', 'IMAGE_SHOWING'];

  el.innerHTML = render(state);
  bind(el, state);

  receive('state:change', () => {
    if (state.changed(props)) {
      el.innerHTML = render(state);
      bind(el);
    }
  });

  return el;
}

function render(state) {
  const { images, IMAGE_SHOWING, LIGHTBOX_OPEN } = state.current;

  const renderImage = (image) => (`
    <img src="${image.original.url}" />
  `);

  return `
    <div class="lightbox" ${LIGHTBOX_OPEN ? '' : 'hidden'}>
      ${IMAGE_SHOWING ? renderImage(images.find((image) => image.id == IMAGE_SHOWING)) : ''}
    </div>
  `;
}

function bind(el, state) {

}
