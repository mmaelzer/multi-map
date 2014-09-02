var Surely = require('surely');
var deepEqual = require('deep-equal');

/**
 *  @param {String=} opt_keyType
 *  @param {String=} opt_valueType
 *  @constructor
 */
function MultiMap(opt_keyType, opt_valueType) {
  this.keys = [];
  this.values = {};
  this.generate = getCallback();
  this._initializeTypes(opt_keyType, opt_valueType);
}

/**
 *  @param {*} key
 *  @param {*} value
 *  @return {*}
 *  @public
 */
MultiMap.prototype.add = function(key, value) {
  var modifiedKey = this.generate(key);
  if (modifiedKey in this.values) {
    this.values[modifiedKey].push(value);
  } else {
    this.keys.splice(this.findIndex(key), 0, modifiedKey);
    this.values[modifiedKey] = [value];
  }
  return this.values[modifiedKey];
};

/**
 *  @param {*} key
 *  @return {Number}
 */
MultiMap.prototype.findIndex = function(key) {
  return binarySearch(this.keys, this.generate(key), this.generate);
};

/**
 *  @param {Function} generate
 *  @return {MultiMap}
 *  @public
 */
MultiMap.prototype.generateKey = Surely
                                  .func('generate')
                                  .wrap(
                                 function(generate) {
  this.generate = getCallback(generate);
  return this;
});

/**
 *  @param {*} key
 *  @return {*}
 *  @public
 */
MultiMap.prototype.get = function(key) {
  return this.values[this.generate(key)];
};

/**
 *  @param {*} start
 *  @param {*} end
 *  @return {Array.<*>}
 *  @public
 */
MultiMap.prototype.getKeysInRange = function(start, end) {
  var index = this.findIndex(this.keys, start);
  var key = this.keys[index];
  var val = key ? this.generate(key) : null;
  var endVal = this.generate(end);
  var keys = [];
  while (val && val <= endVal) {
    keys.push(key);
    key = this.keys[++index];
    val = this.generate(key);
  }
  return keys;
};

/**
 *  @param {*} key
 *  @return {Boolean}
 *  @public
 */
MultiMap.prototype.hasKey = function(key) {
  return this.keys[this.findIndex(key)] === this.generate(key);
};

/**
 *  @param {String} keyType
 *  @param {String} valueType
 *  @private
 */
MultiMap.prototype._initializeTypes = Surely
                                      .string('keyType')
                                      .string('valueType')
                                      .wrap(
                                    function(keyType, valueType) {

  this.add = Surely[keyType]('key')[valueType]('value').wrap(this.add);
  this.get = Surely[keyType]('key').wrap(this.get);
  this.getKeysInRange = Surely[keyType]('start')[keyType]('end').wrap(this.getKeysInRange);
  this.hasKey = Surely[keyType]('key').wrap(this.hasKey);
  this.range = Surely[keyType]('start')[keyType]('end').wrap(this.range);
  this.remove = Surely[keyType]('key').wrap(this.remove);
  this.removeRange = Surely[keyType]('start')[keyType]('end').wrap(this.remove);
  this.removeValueWithKey = Surely[keyType]('key')[valueType]('value').wrap(this.removeValueWithKey);
});

/**
 *  @param {*} start
 *  @param {*} end
 *  @return {Array.<*>}
 *  @public
 */
MultiMap.prototype.range = function(start, end) {
  var self = this;
  return this.getKeysInRange(start, end).reduce(function(values, key) {
    return values.concat(self.values[key]);
  }, []);
};

/**
 *  @param {*} key
 *  @return {*}
 *  @public
 */
MultiMap.prototype.remove = function(key) {
  var index = this.findIndex(key);
  if (this.keys[index] === key) {
    var val = this.values[key];
    delete this.values[key];
    this.keys.splice(index, 1);
    return val;
  }
};

/**
 *  @param {*} start
 *  @param {*} end
 *  @return {Array.<*>}
 *  @public
 */
MultiMap.prototype.removeRange = function(start, end) {
  var keys = this.getKeysInRange(start, end);
  if (keys.length) {
    var startIndex = this.findIndex(start);
    this.keys.splice(startIndex, keys.length);
    var values = [];
    keys.forEach(function(key, index) {
      values.push(this.values[key]);
      delete this.values[key];
    }, this);
    return values;
  }
};

/**
 *  @param {*} key
 *  @param {*} value
 *  @return {Array.<*>|null}
 *  @public
 */
MultiMap.prototype.removeValueWithKey = function(key, value) {
  var values = this.get(key);
  if (values) {
    if (values.length === 1) {
      return this.remove(key);
    } else {
      var modifiedKey = this.generate(key);
      this.values[modifiedKey] = values.filter(function(val) {
        return !deepEqual(val, value);
      });
      return values.length !== this.values[modifiedKey] ? [value] : null;
    }
  }
};

/**
 *  @param {Array.<*>} array
 *  @param {*} key
 *  @param {Function} iterator
 *  @return {Number}
 */
function binarySearch(array, key, iterator) {
  var low = 0;
  var high = array.length;

  while(low < high) {
    var mid = (high + low) >>> 1;
    var val = iterator(array[mid]);
    if (val < key) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
}

/**
 *  @param {*} value
 *  @return {Function}
 */
function getCallback(value) {
  if (!value) {
    return identity;
  }
  if (typeof value === 'function') {
    return value;
  }
  return property(value);
}

/**
 *  @param {*} value
 *  @return {*}
 */
function identity(value) {
  return value;
}

/**
 *  @param {String} key
 *  @return {Function}
 */
function property(key) {
  return function(obj) {
    return obj[key];
  }
}

module.exports = MultiMap;