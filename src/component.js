const { receive } = require('./events.js');

function Component(state, props) {
  this.el = document.createElement('div');

  // On each state change, re-render if these props have changed
  this.props = props;

  // Check this in render() for special first-render behavior
  this.first = true;

  // Skip the re-render cycle for static components
  if (props)  {
    receive('state:change', () => {
      if (state.changed(props)) {
        this.el.innerHTML = this.render(state);
        this.bind && this.bind(state);
        this.first = false;
      }
    });
  }
}

module.exports = Component;
