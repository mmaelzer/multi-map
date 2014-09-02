multi-map
=========

A multimap implementation that optionally allows type enforcement via [surely](https://github.com/mmaelzer/surely).

### Install
```javascript
npm install multi-map
```

---------------------


Example
--------
```javascript
var MultiMap = require('multi-map');

// Create a multimap with number keys and string values
var multimap = new MultiMap('number', 'string');


// -- add values ---
multimap.add(30, 'foo');
multimap.add(30, 'bar');
multimap.add(45, 'baz');


// -- type checking --
var result = multimap.add('33', 'thirtythree');
console.log(result);
// [TypeError: Expected number for 'key']


// -- get values --
var getValue = multimap.get(30);

console.log(getValue);
// ['foo', 'bar']


// -- get values in range --
var rangeValues = multimap.range(0, 100);

console.log(rangeValues);
// ['foo', 'bar', 'baz']


// -- remove --
multimap.remove(30);

console.log(multimap.range(0, 100));
// ['baz']
```


The MIT License
===============

Copyright (c) 2014 Michael Maelzer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.