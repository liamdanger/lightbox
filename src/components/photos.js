module.exports = (state) => {
  let el = document.createElement('div');

  el.id = "photos";
  el.innerHTML = `
    <ul class="photo-grid">
      ${renderPhotos(state.current.photos).join('')}
    </ul>
  `;

  return el;
}

function renderPhotos(photos) {
  return photos.map((photo) => {
    return `
      <li class="photo-grid-item">
        ${photo.title}
      </li>
    `;
  });
}
