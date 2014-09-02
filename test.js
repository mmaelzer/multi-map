var MultiMap = require('./multimap');
var test = require('tape');

test('multimap', function(t) {
  t.plan(9);

  var multimap = new MultiMap();

  var data = {
    1: 'a',
    4: 'd',
    10: 'm'
  };

  Object.keys(data).forEach(function(key) {
    multimap.add(+key, data[key]);
  });

  t.deepEqual([data[1]], multimap.get(1), 'get() in map');
  t.notOk(multimap.get(2), 'get() not in map');
  t.deepEqual([data[1], data[4]], multimap.range(1, 5), 'range()');

  var key = 20;
  var value = 'twenty';

  t.deepEqual([value], multimap.add(key, value), 'add()');
  t.deepEqual([value], multimap.remove(key), 'remove()');
  t.deepEqual(Object.keys(data).map(Number), multimap.getKeysInRange(0, 100), 'getKeysInRange()');

  multimap.add(key, value);
  multimap.add(key, 'twentytwenty');

  t.deepEqual(multimap.removeValueWithKey(key, value), [value], 'removeValueWithKey()');
  t.ok(multimap.removeRange(0, 1000), 'removeRange()');

  var typemap = new MultiMap('number', 'string');

  Object.keys(data).forEach(function(key) {
    typemap.add(+key, data[key]);
  });

  t.ok(typemap.add('1', 'foo') instanceof Error, 'MultiMap(keyType, valueType)');
});