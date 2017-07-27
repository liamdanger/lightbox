const { send, receive } = require('./events.js');

module.exports = {
  current: {},
  prev: {},

  // Preserve the previous state to diff against
  _replaceState: function(newState) {
    this.prev    = this.current;
    this.current = newState;

    console.log(this.current);
  },

  // Merge new set of values to create new current state
  set: function(obj) {
    const newState = Object.assign({}, this.current);

    // Add/update properties on new state
    Object.keys(obj).map((key) => {
      newState[key] = obj[key]
    });

    this._replaceState(newState);

    send('state:change');

    return newState;
  },

  // Returns true if any of the keys in the array differ from previous
  changed: function(props) {
    let anyDifferent = false;

    for(let i = 0; i < props.length; i++) {
      const prop = props[i];

      if (this.prev[prop] != this.current[prop]) {
        anyDifferent = true;
        break;
      }
    }

    return anyDifferent;
  }
}
