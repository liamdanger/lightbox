module.exports = {
  send: (name, data) => {
    const event = new Event(name, data);
    document.dispatchEvent(event);
  },

  receive: (name, callback) => {
    document.addEventListener(name, callback);
  }
}
