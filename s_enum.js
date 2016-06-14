import _ from 'lodash';

// ensure that autoValue is > than all node values
let _getAutoValue = (obj, list) => {
  let autoValue = 1,
    updateAutoValue = function(node) {
      if (typeof node.value !== 'number') {
        return;
      }
      if (node.value > autoValue) {
        autoValue = node.value + 1;
      }
    };
  _.each(obj, updateAutoValue);
  _.each(list, updateAutoValue);
  return autoValue;
};

// ensure that a key is clean camelCase string
let _stringToKey = (str) => {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) { return ''; }
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
};

// get method for SEnum result
let _getNode = function(selector) {
  let node = _.find(this.nodes, x => x.value === selector);
  if (node) return node;
  node = _.find(this.nodes, x => x.key === selector);
  if (node) return node;
  node = _.find(this.nodes, x => x.label === selector);
  if (node) return node;
  // numeric value, passed in as a string selector "31" -> 31
  let selectorInt = parseInt(selector);
  if (!isNaN(selectorInt)) {
    node = _.find(this.nodes, x => x.value === selectorInt);
    if (node) return node;
    node = _.find(this.nodes, x => x.key === selectorInt);
    if (node) return node;
  }
  return node; // undefined
};

// get method for SEnum result
let _get = function(selector, field, defaultValue) {
  const node = _getNode(selector);
  if (!node) {
    return defaultValue;
  }
  if (!field) {
    // no field = return the whole node
    return node;
  }
  if (!_.has(node, field)) {
    return defaultValue;
  }
  // return's the value for the field - if a function executes it
  return _.result(node, field);
};

export default function SEnum(list) {

  let obj = {
    // functions
    get: _get,
    value: function(selector, defaultValue) {
      return this.get(selector, 'value', defaultValue);
    },
    label: function(selector, defaultLabel) {
      return this.get(selector, 'label', defaultLabel);
    },
    keys: function() {   return _.map(this.nodes, (x) => { return x.key; }); },
    values: function() { return _.map(this.nodes, (x) => { return x.value; }); },
    labels: function() { return _.map(this.nodes, (x) => { return x.label; }); },
    options: function() { return _.zipObject(this.values(), this.labels()); },
    // raw list of nodes
    nodes: []
  };

  // assign functions
  obj.get = _get;

  // assign all values from list of inputs
  _.each(list, function(node, key) {

    // ensure it is an object
    if (typeof node === 'string') {
      // string = label
      node = { value: key, label: node };
    }
    if (typeof node === 'number') {
      // number = value
      node = { value: node, label: key };
    }
    if (typeof node !== 'object') {
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
    let index = obj.nodes.length;
    obj.nodes.push(node);

    // add shortcuts to node;
    obj[node.key] = obj.nodes[index];
    if (typeof node.value === 'string' || typeof node.value === 'number') {
      obj[node.value] = obj.nodes[index];
    }

  });

  return obj;
}

