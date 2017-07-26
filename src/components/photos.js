module.exports = (state) => {
  const el = document.createElement('div');
  const props = ["photos"];

  el.id = "photos";
  render(el, state);

  document.addEventListener('state:change', () => {
    if (state.changed(props)) {
      render(el, state);
    }
  });

  return el;
}

function render(el, state) {
  el.innerHTML = `
    <ul class="photo-grid">
      ${renderPhotos(state.current.photos)}
    </ul>
  `;
}

function renderPhotos(photos) {
  return photos.map((photo) => {
    return `
      <li class="photo-grid-item">
        ${photo.title}
      </li>
    `;
  }).join('');
}
