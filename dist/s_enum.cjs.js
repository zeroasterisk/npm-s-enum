'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _zipObject2 = require('lodash/zipObject');

var _zipObject3 = babelHelpers.interopRequireDefault(_zipObject2);

var _map2 = require('lodash/map');

var _map3 = babelHelpers.interopRequireDefault(_map2);

var _result2 = require('lodash/result');

var _result3 = babelHelpers.interopRequireDefault(_result2);

var _has2 = require('lodash/has');

var _has3 = babelHelpers.interopRequireDefault(_has2);

var _find2 = require('lodash/find');

var _find3 = babelHelpers.interopRequireDefault(_find2);

var _each2 = require('lodash/each');

var _each3 = babelHelpers.interopRequireDefault(_each2);

exports.default = SEnum;


// ensure that autoValue is > than all node values
var _getAutoValue = function _getAutoValue(obj, list) {
  var autoValue = 1,
      updateAutoValue = function updateAutoValue(node) {
    if (typeof node.value !== 'number') {
      return;
    }
    if (node.value > autoValue) {
      autoValue = node.value + 1;
    }
  };
  (0, _each3.default)(obj, updateAutoValue);
  (0, _each3.default)(list, updateAutoValue);
  return autoValue;
};

// ensure that a key is clean camelCase string
var _stringToKey = function _stringToKey(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) {
      return '';
    }
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
};

// get method for SEnum result
var _get = function _get(selector, field, defaultValue) {
  var _this = this;

  if (!selector) {
    return defaultValue;
  }
  var node = (0, _find3.default)(this.nodes, function (x) {
    return x.value === selector;
  });
  if (!node) {
    node = (0, _find3.default)(this.nodes, function (x) {
      return x.key === selector;
    });
  }
  if (!node) {
    node = (0, _find3.default)(this.nodes, function (x) {
      return x.label === selector;
    });
  }
  if (!node) {
    (function () {
      // numeric value, passed in as a string selector "31" -> 31
      var selectorInt = parseInt(selector);
      if (!isNaN(selectorInt)) {
        node = (0, _find3.default)(_this.nodes, function (x) {
          return x.value === selectorInt;
        });
        if (!node) {
          node = (0, _find3.default)(_this.nodes, function (x) {
            return x.key === selectorInt;
          });
        }
      }
    })();
  }
  if (!node) {
    return defaultValue;
  }
  if (!field) {
    // no field = return the whole node
    return node;
  }
  if (!(0, _has3.default)(node, field)) {
    return defaultValue;
  }
  // return's the value for the field - if a function executes it
  return (0, _result3.default)(node, field);
};

function SEnum(list) {

  var obj = {
    // functions
    get: _get,
    value: function value(selector, defaultValue) {
      return this.get(selector, 'value', defaultValue);
    },
    label: function label(selector, defaultLabel) {
      return this.get(selector, 'label', defaultLabel);
    },
    keys: function keys() {
      return (0, _map3.default)(this.nodes, function (x) {
        return x.key;
      });
    },
    values: function values() {
      return (0, _map3.default)(this.nodes, function (x) {
        return x.value;
      });
    },
    labels: function labels() {
      return (0, _map3.default)(this.nodes, function (x) {
        return x.label;
      });
    },
    options: function options() {
      return (0, _zipObject3.default)(this.values(), this.labels());
    },
    // raw list of nodes
    nodes: []
  };

  // assign functions
  obj.get = _get;

  // assign all values from list of inputs
  (0, _each3.default)(list, function (node, key) {

    // ensure it is an object
    if (typeof node === 'string') {
      // string = label
      node = { value: key, label: node };
    }
    if (typeof node === 'number') {
      // number = value
      node = { value: node, label: key };
    }
    if ((typeof node === 'undefined' ? 'undefined' : babelHelpers.typeof(node)) !== 'object') {
      // skip...
      return;
    }

    // ensure it has a value (auto = 1 more than highest value: 1,2,3...)
    if (typeof node.value === 'undefined') {
      node.value = _getAutoValue(obj, list);
    }

    // ensure it has a key (auto = camelCase of label if set)
    if (typeof node.key === 'undefined') {
      if (typeof node.label === 'string') {
        node.key = _stringToKey(node.label);
      } else {
        node.key = _stringToKey(node.value);
      }
    }

    // ensure is has a label (auto = matches key)
    if (typeof node.label === 'undefined') {
      node.label = node.key;
    }

    // add node to list
    var index = obj.nodes.length;
    obj.nodes.push(node);

    // add shortcuts to node;
    obj[node.key] = obj.nodes[index];
    if (typeof node.value === 'string' || typeof node.value === 'number') {
      obj[node.value] = obj.nodes[index];
    }
  });

  return obj;
}

