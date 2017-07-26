module.exports = {
  current: {},
  prev: {},

  // Preserve the previous state to diff against
  _replaceState: function(newState) {
    this.prev    = this.current;
    this.current = newState;
  },

  // Inform the rest of the app of a new state
  _dispatchEvent: function(newState) {
    const event = new Event('render', newState);
    document.dispatchEvent(event);
  },

  // Merge new set of values to create new current state
  set: function(obj) {
    const newState = Object.assign({}, this.current);

    // Add/update properties to form new state
    Object.keys(obj).map((key) => {
      newState[key] = obj[key]
    });

    this._replaceState(newState);
    this._dispatchEvent(newState);

    return newState;
  }
}
