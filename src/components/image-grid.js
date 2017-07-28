const Component = require('../component.js');
const state = require('../state.js');
const { click } = require('../events.js');

const ImageGrid = new Component(state, ['images']);

ImageGrid.render = function(state) {
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
  } else if (query.length > 0 && images.length < 1) {
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

ImageGrid.bind = function(state) {
  const images = this.el.querySelectorAll('.image-grid-item');

  images.forEach((image) => {
    click(image, (e) => {
      state.set({ 
        LIGHTBOX_OPEN: true, 
        imageShowing: image.id 
      });
    });
  });
}

module.exports = ImageGrid;
