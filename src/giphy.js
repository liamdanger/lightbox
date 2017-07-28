const API_KEY = '6d12f1d593484e63bb9082eaa406a653';
const API_HOST = '//api.giphy.com';
const API_SEARCH_PATH = '/v1/gifs/search';

module.exports = (q) => {
  const request = constructRequest(API_KEY, q);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', request);
    xhr.onload = () => resolve(formatResponse(JSON.parse(xhr.responseText))); 
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
}

function formatResponse(response) {
  return response.data.map((item) => (
    {
      preview: item.images.fixed_width_still,
      original: item.images.original,
      id: item.id,
      url: item.embed_url
    }
  ));
}

function constructRequest(key, q) {
  return `${API_HOST}${API_SEARCH_PATH}?api_key=${key}&q=${q}&rating=g`;
}
