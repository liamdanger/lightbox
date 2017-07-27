(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var _require = require('../events.js'),
    send = _require.send,
    receive = _require.receive;

module.exports = function (state) {
  var el = document.createElement('div');
  var props = ["images"];

  receive('state:change', function () {
    if (state.changed(props)) {
      el.innerHTML = render(state);
      bind(el, state);
    }
  });

  return el;
};

function render(state) {
  var renderImages = function (images) {
    return images.map(function (image) {
      return '\n      <li id="' + image.id + '" class="image-grid-item">\n        <img src="' + image.preview.url + '" />\n      </li>';
    }).join('');
  };

  return '\n    <ul class="image-grid">\n      ' + renderImages(state.current.images) + '\n    </ul>\n  ';
}

function bind(el, state) {
  var images = el.querySelectorAll('.image-grid-item');

  images.forEach(function (image) {
    image.addEventListener('click', function (e) {
      state.set({
        LIGHTBOX_OPEN: true,
        IMAGE_SHOWING: image.id
      });
    });
  });
}
},{"../events.js":4}],2:[function(require,module,exports){
var _require = require('../events.js'),
    send = _require.send,
    receive = _require.receive;

module.exports = function (state) {
  var el = document.createElement('div');
  var props = ['LIGHTBOX_OPEN', 'IMAGE_SHOWING'];

  receive('state:change', function () {
    if (state.changed(props)) {
      el.innerHTML = render(state);
      bind(el, state);
    }
  });

  return el;
};

function render(state) {
  var _state$current = state.current,
      images = _state$current.images,
      IMAGE_SHOWING = _state$current.IMAGE_SHOWING,
      LIGHTBOX_OPEN = _state$current.LIGHTBOX_OPEN;


  var renderImage = function (image) {
    return '\n    <img class="lightbox-image" src="' + image.original.url + '" />\n  ';
  };

  return '\n    <div class="lightbox" ' + (LIGHTBOX_OPEN ? '' : 'hidden') + '>\n      ' + (IMAGE_SHOWING ? renderImage(getCurrentImage(images, IMAGE_SHOWING)) : '') + '\n      <button class="lightbox-close">\u274C</button>\n      <button class="lightbox-prev">\uD83D\uDD19</button>\n      <button class="lightbox-next">\uD83D\uDD1C</button>\n    </div>\n  ';
}

function bind(el, state) {
  var _state$current2 = state.current,
      images = _state$current2.images,
      IMAGE_SHOWING = _state$current2.IMAGE_SHOWING;


  var close = el.querySelector('.lightbox-close');
  close.addEventListener('click', function (e) {
    state.set({ LIGHTBOX_OPEN: false });
  });

  var next = el.querySelector('.lightbox-next');
  next.addEventListener('click', function (e) {
    return advanceImage(1);
  });

  var prev = el.querySelector('.lightbox-prev');
  prev.addEventListener('click', function (e) {
    return advanceImage(-1);
  });

  function advanceImage(direction) {
    state.set({
      IMAGE_SHOWING: getSiblingImage(images, IMAGE_SHOWING, direction).id
    });
  }
}

function getSiblingImage(images, IMAGE_SHOWING, delta) {
  var image = getCurrentImage(images, IMAGE_SHOWING);
  var position = images.indexOf(image) + delta;

  if (position >= images.length) {
    position = 0;
  }
  if (position <= -1) {
    position = images.length - 1;
  }

  return images[position];
}

function getCurrentImage(images, IMAGE_SHOWING) {
  return images.find(function (image) {
    return image.id == IMAGE_SHOWING;
  });
}
},{"../events.js":4}],3:[function(require,module,exports){
var searchGifs = require('../giphy.js');

var _require = require('../events.js'),
    send = _require.send,
    receive = _require.receive;

module.exports = function (state) {
  var el = document.createElement('div');

  el.innerHTML = render();
  bind(el, state);

  return el;
};

function bind(el, state) {
  var form = el.querySelector('.search-form');

  form.addEventListener('submit', function (e) {
    submitSearch(e, state);
  });
}

function render() {
  return '\n    <form class="search-form">\n      <input class="search-form-field" id="search-form-q" name="q" type="search" />\n      <button class="search-form-button" title="Search">\uD83D\uDD0D</button>\n    </form>\n  ';
}

function submitSearch(e, state) {
  e.preventDefault();

  var input = document.getElementById('search-form-q');
  var query = input.value;

  // Clear field on successful search
  input.value = "";

  searchGifs(query).then(function (images) {
    state.set({ images: images });
  });
}
},{"../events.js":4,"../giphy.js":5}],4:[function(require,module,exports){
module.exports = {
  send: function (name) {
    var event = new Event(name);
    document.dispatchEvent(event);
  },

  receive: function (name, callback) {
    document.addEventListener(name, callback);
  }
};
},{}],5:[function(require,module,exports){
var API_KEY = '6d12f1d593484e63bb9082eaa406a653';
var API_HOST = '//api.giphy.com';
var API_SEARCH_PATH = '/v1/gifs/search';

module.exports = function (q) {
  var request = constructRequest(API_KEY, q);

  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', request);
    xhr.onload = function () {
      return resolve(formatResponse(JSON.parse(xhr.responseText)));
    };
    xhr.onerror = function () {
      return reject(xhr.statusText);
    };
    xhr.send();
  });
};

function formatResponse(response) {
  return response.data.map(function (item) {
    return {
      preview: item.images.fixed_width_still,
      original: item.images.original,
      id: item.id,
      url: item.embed_url
    };
  });
}

function constructRequest(key, q) {
  return '' + API_HOST + API_SEARCH_PATH + '?api_key=' + key + '&q=' + q;
}
},{}],6:[function(require,module,exports){
var state = require('./state.js');
window.state = state;

var search = require('./components/search.js');
var imageGrid = require('./components/image-grid.js');
var lightbox = require('./components/lightbox.js');

// Set initial app state
state.set({
  LOADING: false,
  LIGHTBOX_OPEN: false,
  IMAGE_SHOWING: '',
  images: []
});

var main = document.createElement('main');
main.appendChild(search(state));
main.appendChild(imageGrid(state));
main.appendChild(lightbox(state));

document.body.appendChild(main);
},{"./components/image-grid.js":1,"./components/lightbox.js":2,"./components/search.js":3,"./state.js":7}],7:[function(require,module,exports){
var _require = require('./events.js'),
    send = _require.send,
    receive = _require.receive;

module.exports = {
  current: {},
  prev: {},

  // Preserve the previous state to diff against
  _replaceState: function (newState) {
    this.prev = this.current;
    this.current = newState;

    console.log(this.current);
  },

  // Merge new set of values to create new current state
  set: function (obj) {
    var newState = Object.assign({}, this.current);

    // Add/update properties on new state
    Object.keys(obj).map(function (key) {
      newState[key] = obj[key];
    });

    this._replaceState(newState);

    send('state:change');

    return newState;
  },

  // Returns true if any of the keys in the array differ from previous
  changed: function (props) {
    var anyDifferent = false;

    for (var i = 0; i < props.length; i++) {
      var prop = props[i];

      if (this.prev[prop] != this.current[prop]) {
        anyDifferent = true;
        break;
      }
    }

    return anyDifferent;
  }
};
},{"./events.js":4}]},{},[6]);
