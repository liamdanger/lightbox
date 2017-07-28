module.exports = {
  send: (name) => {
    const event = new Event(name);
    document.dispatchEvent(event);
  },

  receive: (name, callback) => {
    document.addEventListener(name, callback);
  },

  submit: (el, callback) => {
    el.addEventListener('submit', callback);
  },

  click: (el, callback) => {
    el.addEventListener('click', callback);
  }
}
