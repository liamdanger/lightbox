(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var _require = require('./events.js'),
    receive = _require.receive;

function Component(state, props) {
  var _this = this;

  this.el = document.createElement('div');

  // On each state change, re-render if these props have changed
  this.props = props;

  // Check this in render() for special first-render behavior
  this.first = true;

  // Skip the re-render cycle for static components
  if (props) {
    receive('state:change', function () {
      if (state.changed(props)) {
        _this.el.innerHTML = _this.render(state);
        _this.bind && _this.bind(state);
        _this.first = false;
      }
    });
  }
}

module.exports = Component;
},{"./events.js":5}],2:[function(require,module,exports){
var Component = require('../component.js');
var state = require('../state.js');

var _require = require('../events.js'),
    click = _require.click;

var ImageGrid = new Component(state, ['images']);

ImageGrid.render = function (state) {
  var _state$current = state.current,
      images = _state$current.images,
      query = _state$current.query;


  var renderImages = function (images) {
    return images.map(function (image) {
      return '\n      <li tabindex="0" id="' + image.id + '" class="image-grid-item">\n        <img src="' + image.preview.url + '" />\n      </li>';
    }).join('');
  };

  // Nothing searched yet
  if (query.length < 1 && images.length < 1) {
    return '\n      <p class="image-grid-error">Search to see lots of wonderful GIFs!</p>\n    ';
    // No results
  } else if (query.length > 0 && images.length < 1) {
    return '\n      <p class="image-grid-error">No results found for "' + query + '".</p>\n    ';
    // Displaying results
  } else {
    return '\n      <ul class="image-grid">\n        ' + renderImages(images) + '\n      </ul>\n    ';
  }
};

ImageGrid.bind = function (state) {
  var images = this.el.querySelectorAll('.image-grid-item');

  images.forEach(function (image) {
    click(image, function (e) {
      state.set({
        LIGHTBOX_OPEN: true,
        imageShowing: image.id
      });
    });
  });
};

module.exports = ImageGrid;
},{"../component.js":1,"../events.js":5,"../state.js":8}],3:[function(require,module,exports){
var Component = require('../component.js');
var state = require('../state.js');

var _require = require('../events.js'),
    click = _require.click;

var Lightbox = new Component(state, ['LIGHTBOX_OPEN', 'imageShowing']);

Lightbox.render = function (state) {
  var _state$current = state.current,
      images = _state$current.images,
      imageShowing = _state$current.imageShowing,
      LIGHTBOX_OPEN = _state$current.LIGHTBOX_OPEN;


  var renderImage = function (image) {
    return '\n    <img class="lightbox-image" src="' + image.original.url + '" />\n  ';
  };

  return '\n    <div class="lightbox" ' + (LIGHTBOX_OPEN ? '' : 'hidden') + '>\n      ' + (imageShowing ? renderImage(getCurrentImage(images, imageShowing)) : '') + '\n      <button title="Next" class="circle-button lightbox-button lightbox-next">\uD83D\uDD1C</button>\n      <button title="Previous" class="circle-button lightbox-button lightbox-prev">\uD83D\uDD19</button>\n      <button title="Close" class="circle-button lightbox-button lightbox-close">\u274C</button>\n    </div>\n    <div class="lightbox-mask" ' + (LIGHTBOX_OPEN ? '' : 'hidden') + ' />\n  ';
};

Lightbox.bind = function (state) {
  var _state$current2 = state.current,
      images = _state$current2.images,
      imageShowing = _state$current2.imageShowing;


  var close = this.el.querySelector('.lightbox-close');
  var mask = this.el.querySelector('.lightbox-mask');
  var next = this.el.querySelector('.lightbox-next');
  var prev = this.el.querySelector('.lightbox-prev');

  click(close, function () {
    return state.set({ LIGHTBOX_OPEN: false });
  });
  click(mask, function () {
    return state.set({ LIGHTBOX_OPEN: false });
  });
  click(next, function () {
    return advanceImage(1);
  });
  click(prev, function () {
    return advanceImage(-1);
  });

  function advanceImage(direction) {
    state.set({
      imageShowing: getSiblingImage(images, imageShowing, direction).id
    });
  }
};

function getSiblingImage(images, imageShowing, delta) {
  var image = getCurrentImage(images, imageShowing);
  var position = images.indexOf(image) + delta;

  if (position >= images.length) {
    position = 0;
  }
  if (position <= -1) {
    position = images.length - 1;
  }

  return images[position];
}

function getCurrentImage(images, imageShowing) {
  return images.find(function (image) {
    return image.id == imageShowing;
  });
}

module.exports = Lightbox;
},{"../component.js":1,"../events.js":5,"../state.js":8}],4:[function(require,module,exports){
var Component = require('../component.js');
var state = require('../state.js');

var _require = require('../events.js'),
    send = _require.send,
    submit = _require.submit;

var searchGifs = require('../giphy.js');

var Search = new Component(state, ['LOADING']);

Search.bind = function (state) {
  var _this = this;

  var form = this.el.querySelector('.search-form');

  submit(form, function (e) {
    return submitSearch(_this.getQuery(e), state);
  });
};

Search.render = function (state) {
  var _state$current = state.current,
      query = _state$current.query,
      LOADING = _state$current.LOADING;


  if (this.first && query) {
    submitSearch(query, state);
  }

  return '\n    <form class="search-form">\n      <input ' + (LOADING ? 'disabled' : '') + ' value="' + query + '" placeholder="Search for GIFs!" class="search-form-field" id="search-form-q" name="q" type="search" />\n      <button ' + (LOADING ? 'disabled' : '') + ' class="search-form-button" title="Search">\uD83D\uDD0D</button>\n    </form>\n  ';
};

Search.getQuery = function (e) {
  e.preventDefault();

  return this.el.querySelector('#search-form-q').value;
};

function submitSearch(query, state) {
  send('search:submit');

  state.set({ LOADING: true });

  searchGifs(query).then(function (images) {
    state.set({
      images: images,
      imageShowing: '',
      LOADING: false,
      LIGHTBOX_OPEN: false,
      query: query
    });

    history.pushState(state.current, 'Search results for "' + query + '"', '?q=' + query);
  });
}

module.exports = Search;
},{"../component.js":1,"../events.js":5,"../giphy.js":6,"../state.js":8}],5:[function(require,module,exports){
module.exports = {
  send: function (name) {
    var event = new Event(name);
    document.dispatchEvent(event);
  },

  receive: function (name, callback) {
    document.addEventListener(name, callback);
  },

  submit: function (el, callback) {
    el.addEventListener('submit', callback);
  },

  click: function (el, callback) {
    el.addEventListener('click', callback);
  }
};
},{}],6:[function(require,module,exports){
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
  return '' + API_HOST + API_SEARCH_PATH + '?api_key=' + key + '&q=' + q + '&rating=g';
}
},{}],7:[function(require,module,exports){
var state = require('./state.js');

var Search = require('./components/search.js');
var ImageGrid = require('./components/image-grid.js');
var Lightbox = require('./components/lightbox.js');

// If there's a query already, set it to render
var query = decodeURI(window.location.search.replace('?q=', '').trim()) || '';

// Set initial app state
state.set({
  LOADING: false,
  LIGHTBOX_OPEN: false,
  imageShowing: '',
  query: query,
  images: []
});

var main = document.createElement('main');
main.appendChild(Search.el);
main.appendChild(ImageGrid.el);
main.appendChild(Lightbox.el);

document.body.appendChild(main);
},{"./components/image-grid.js":2,"./components/lightbox.js":3,"./components/search.js":4,"./state.js":8}],8:[function(require,module,exports){
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
  },

  // Merge new set of values to create new current state
  set: function (obj) {
    var newState = Object.assign({}, this.current, obj);

    this._replaceState(newState);

    send('state:change');

    return newState;
  },

  // Returns true if any of the keys in the array differ from previous
  changed: function (props) {
    for (var i = 0; i < props.length; i++) {
      var prop = props[i];

      if (this.prev[prop] !== this.current[prop]) {
        return true;
      }
    }

    return false;
  }
};
},{"./events.js":5}]},{},[7]);
