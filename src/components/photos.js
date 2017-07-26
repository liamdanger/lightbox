const { send, receive } = require('../events.js');

module.exports = (state) => {
  const el = document.createElement('div');
  const props = ["photos"];

  el.innerHTML = render(state);

  receive('state:change', () => {
    if (state.changed(props)) {
      el.innerHTML = render(state);
    }
  });

  return el;
}

function render(state) {
  return `
    <ul class="photo-grid">
      ${renderPhotos(state.current.photos)}
    </ul>
  `;

  function renderPhotos(photos) {
    return photos.map((photo) => {
      return `
        <li class="photo-grid-item">
          ${photo.title}
        </li>
      `;
    }).join('');
  }
}

