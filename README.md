# Elegant Standard

![npm bundle size](https://img.shields.io/bundlephobia/minzip/elegant-standard)
![GitHub issues](https://img.shields.io/github/issues/AkhileshNS/elegant-standard)
![GitHub](https://img.shields.io/github/license/AkhileshNS/elegant-standard)
![GitHub package.json version](https://img.shields.io/github/package-json/v/AkhileshNS/elegant-standard)

JavaScript is often filled with weird surprises that can catch people off guard (often the tradeoff for the incredible flexibility it provides). To combat this, we, at onCreators use an in-house standard called the elegant standard, quite literally called that to emphasize on writing code that elegantly handles any bizarre or unforeseen scenarios in JS.

The Elegant Standard as well as being a standard (set of rules) which developers can follow in order to ensure that their code is better handled is also a library that provides various convenience functions to do the same. On that note, the standard can be broken up into two major parts:-

- The Functions
- The Rules

## Getting Started

The elegant-standard is available as an npm package. So to open, simply open any project that uses npm (or yarn) and install it using:-

```npm
npm install --save elegant-standard
```

Or using yarn

```yarn
yarn add elegant-standard
```

Then in your project, import it as either CommonJS or ES6 Modules:-

```javascript
import elegantly from 'elegant-standard'; // ES6
import {type, check /*etc*/} from 'elegant-standard';

const elegantly = require("elegant-standard"); // CJS
const {type, check /*etc*/} = require('elegant-standard');
```

## The Functions

| id   | Name                                    | Description                                                  |
| ---- | --------------------------------------- | ------------------------------------------------------------ |
| 1    | [type](#type)                           | A better alternative to JavaScript's `typeof`                |
| 2    | [define](#define)                       | A function to handle `undefined` and `null`                  |
| 3    | [check](#check)                         | A function that combines `type` and `define`                 |
| 4    | [isString](#isString)                   | A function to check if an element is a String                |
| 5    | [isUString](#isUnemptyString-or-isUString) | A function to check if an element is a String and it isn't empty |
| 6    | [isBoolean](#isBoolean)                 | A function to check if an element is a Boolean               |
| 7    | [isNumber](#isNumber)                   | A function to check if an element is a Number                |
| 8    | [isRegExp](#isRegExp)                   | A function to check if an element is a Reguler Expression    |
| 9    | [isObject](#isObject)                   | A function to check if an element is an Object               |
| 10   | [isUObject](#isUnemptyObject-or-isUObject) | A function to check if an element is an Object and if the Object has properties |
| 11   | [isArray](#isArray)                     | A function to check if an element is an Array                |
| 12   | [isUArray](#isUnemptyArray-or-isUArray)    | A function to check if an element is an Array and if it isn't empty |
| 13   | [isEquivalent](#isEquivalent)           | A function to check if two strings are equal while ignoring case |
| 14   | [isSimilar](#isSimilar)                 | A function to check if two string or a string and a number are equivalent |
| 15   | [isEmail](#isEmail)                     | A function to check if a string is of the format "placeholder@placeholder.placeholder" |
| 16   | [contains](#contains)                   | An `includes` alternative that ignores case                  |
| 17   | [test](#test)                           | An alternative to `.test()` that ignores numbers             |
| 18   | [oneOf](#oneOf)                         | A function that allows for running multiple regex tests or string comparisons on a single string and seeing if it passes atleast one of them |
| 19   | [allOf](#allOf)                         | A function that allows for running multiple regex tests or string comparisons on a single string and seeing if it passes all of them |
| 20   | [get](#get)                             | A function that elegantly retrieves items in an array        |

- ### type

  **arguments**: 

  - element: Any 

  **output**: String

  **source**:

  ```javascript
  function type(element) {
      return Object.prototype.toString.call(element).split(" ")[1].slice(0,  -1).toLowerCase();
  }
  ```

  **description**:

  JavaScript provides a function called `typeof` to check the type of its variables but the `typeof` comes with some serious limitations:- 

  ```javascript 
  typeof("")        // prints "string"
  typeof(1)         // prints "number"
  typeof(true)      // prints "boolean"
  typeof(undefined) // prints "undefined"
  
  typeof({})        // prints "object"
  typeof([])        // prints "object" as well. Wait what?
  typeof(null)      // prints "object" again, eh?
  typeof(/re/g)     // prints "object" again. Ok now its just printing "object" for everything
  ```

  This is kind of a problem, so to fix it, developers have been using the far more accurate `Object.prototype.toString.call()` function instead

  ```javascript
  Object.prototype.toString.call("")    // prints "[object String]"
  Object.prototype.toString.call(1)     // prints "[object Number]"
  Object.prototype.toString.call(true)  // prints "[object Boolean]"
  Object.prototype.toString.call()      // prints "[object Undefined]"
  
  Object.prototype.toString.call({})    // prints "[object Object]"
  Object.prototype.toString.call([])    // prints "[object Array]"
  Object.prototype.toString.call(null)  // prints "[object Null]"
  Object.prototype.toString.call(/re/g) // prints "[object RegExp]" 
  ```

  Thats so much better, but it could still use some improvement, for one, we shouldn't have to write `Object.prototype.toString.call()` every time we want to check the type of something. Also lets get rid of the extra "[object" and "]" and make it lowercase for easier checking. 

  ```javascript
  const {type} = require('elegant-standard');
  
  type("")    // prints "string"
  type(1)     // prints "number"
  type(true)  // prints "boolean"
  type()      // prints "undefined"
  
  type({})    // prints "object"
  type([])    // prints "array"
  type(null)  // prints "null"
  type(/re/g) // prints "regexp"
  ```

- ### define

  **arguments**:

  - element: Any
  - default: Any

  **output**: default (if not null or undefined) else []

  **source**:

  ```javascript
  function define(el, def) {
    return (
      el !== undefined && el !== null ? el : 
    	def !== undefined && def !== null ? def : 
    	[]
    );
  };
  ```

  **description**:

  `undefined` and `null` can sometimes be annoying to work with in JS. 

  ```javascript
  let arr = getArrOfResultsFromServer(); // Error occurs and undefined is returned 
  
  function getLast(arr) {
      return arr[arr.length -1];
  }
  
  let last = getLast(arr); // undefined is passed, leading to a bizarre crash 
  ```

  As application developers, its important to try and hide as many errors that occur on our side from the users. So to avoid the above kind of error, the `define` function was created, which returns some predictable default value (of your choice) in the event that a passed variable is either undefined or null:-

  ```javascript
  const {define} = require('elegant-standard');
  
  let arr = getArrOfResultsFromServer(); // Error occurs and undefined is returned 
  
  function getLast(arr) {
     	let Arr = define(arr, [null])
      return Arr[Arr.length -1];
  }
  
  let last = getLast(arr); 
  if (last!==null) {/* use 'last' to do something */}
  ```

  Note. We are aware that you could also just do 

  ```javascript
  arr || [null]
  ```

  But this doesn't handle empty strings very well:-

  ```javascript
  ("" || null);     // returns null instead of ""
  define("", null); // returns "" 
  ```

- ### check

  **arguments**:

  - element: Any
  - type: String
  - default: Any

  **output**: default (if not null or undefined) else type default

  **source**:

  ```javascript
  function check(el, type, def) {
    type = elegantly.type(type)!=="string" ? "array" : type.toLowerCase();
    return (
    	elegantly.type(el)===type ? el :
      def!==undefined && def!==null ? def :
      type==="object" ? {} : 
      type==="array" ? [] :
      null
    );
  };
  ```

  **description**: 

  The `check` function is used to check if an element is a specified type and to return a default in the event that it is not:-

  ```javascript
  const {check} = require('elegant-standard');
  
  check([1, 2], "array"); // returns [1, 2]
  check({}, "array"); // returns []
  check([], "object"); // returns {}
  check([], "object", null) // returns null;
  
  /*
  	Note. if no default is specified, then the following defaults are used:-
  	"array" - []
  	"object" - {}
  	anything else - null
  */
  ```

  So it is best to think of the `check` function like a combination of the `type` and `define`:-

  ```javascript
  const {check, type, define} = require('elegant-standard');
  
  let arr = null;
  
  // type and define
  if (type(arr)==="array") {
      return arr;
  } else {
      return define(arr, []);
  }
  
  // check
  return check(arr, "array", []);
  ```

- ### isString

  **arguments**: 

  - element: Any

  **output**: Boolean

  **source**:

  ```javascript
  function isString(element) {
      return type(element)==="string";
  }
  ```

  **description**: 

  Just a function that shortens `type(element)==="string"`:-

  ```javascript
  const {type, isString} from 'elegant-standard';
  
  type("")==="string"; // prints true
  isString("");        // prints true
  ```

- ### isUnemptyString or isUString

  **arguments**: 

  - element: Any

  **output**: Boolean

  **source**:

  ```javascript
  function isUnemptyString(element) {
      return type(element)==="string" && element!=="";
  }
  var isUString = isUnemptyString;
  ```

  **description**: 

  A function that checks if an element is a string and isn't empty

  ```javascript
  const {isString, isUnemptyString, isUString} = require('elegant-standard');
  
  isString("");        // prints true
  isUnemptyString(""); // prints false
  isUString("");       // prints false
  isUString("foo")     // prints true
  ```

- ### isBoolean

  **arguments**: 

  - element: Any

  **output**: Boolean

  **source**:

  ```javascript
  function isBoolean(element) {
      return type(element)==="boolean";
  }
  ```

  **description**: 

  Just a function that shortens `type(element)==="boolean"`:-

  ```javascript
  const {type, isBoolean} from 'elegant-standard';
  
  type(false)==="boolean"; // prints true
  isBoolean(false);        // prints true
  ```
  
- ### isNumber

  **arguments**: 

  - element: Any

  **output**: Boolean

  **source**:

  ```javascript
  function isNumber(element) {
      return type(element)==="number";
  }
  ```

  **description**: 

  Just a function that shortens `type(element)==="number"`:-

  ```javascript
  const {type, isNumber} from 'elegant-standard';
  
  type(1)==="number"; // prints true
  isNumber(1);        // prints true
  ```

- ### isRegExp

  **arguments**: 

  - element: Any

  **output**: Boolean

  **source**:

  ```javascript
  function isRegExp(element) {
      return type(element)==="regexp";
  }
  ```

  **description**: 

  Just a function that shortens `type(element)==="regexp"`:-

  ```javascript
  const {type, isRegExp} from 'elegant-standard';
  
  type(/12/ig)==="regexp"; // prints true
  isRegExp(/12/ig);        // prints true
  ```

- ### isObject

  **arguments**: 

  - element: Any

  **output**: Boolean

  **source**:

  ```javascript
  function isObject(element) {
      return type(element)==="object";
  }
  ```

  **description**: 

  Just a function that shortens `type(element)==="object"`:-

  ```javascript
  const {type, isObject} from 'elegant-standard';
  
  type({})==="object"; // prints true
  isObject({});        // prints true
  ```

- ### isUnemptyObject or isUObject

  **arguments**: 

  - element: Any

  **output**: Boolean

  **source**:

  ```javascript
  function isUnemptyObject(element) {
      return type(element)==="object" && Object.entries(element).length>0;
  }
  var isUObject = isUnemptyObject;
  ```

  **description**: 

  A function that checks if an element is an object and isn't empty. (i.e has properties)

  ```javascript
  const {isObject, isUnemptyObject, isUObject} = require('elegant-standard');
  
  isObject({});            // prints true
  isUnemptyObject({});     // prints false
  isUObject({});           // prints false
  isUObject({foo: "bar"}); // prints true
  ```

- ### isArray

  **arguments**: 

  - element: Any

  **output**: Boolean

  **source**:

  ```javascript
  function isArray(element) {
      return type(element)==="array";
  }
  ```

  **description**: 

  Just a function that shortens `type(element)==="object"`:-

  ```javascript
  const {type, isArray} from 'elegant-standard';
  
  type([])==="array"; // prints true
  isArray([]);        // prints true
  ```

- ### isUnemptyArray or isUArray

  **arguments**: 

  - element: Any

  **output**: Boolean

  **source**:

  ```javascript
  function isUnemptyArray(element) {
      return type(element)==="array" && element.length>0;
  }
  var isUArray = isUnemptyArray;
  ```

  **description**: 

  A function that checks if an element is an array and isn't empty.

  ```javascript
  const {isArray, isUnemptyArray, isUArray} = require('elegant-standard');
  
  isArray([]);        // prints true
  isUnemptyArray([]); // prints false
  isUArray([]);       // prints false
  isUArray([1]);      // prints true
  ```

- ### isEquivalent

  **arguments**:

  - str1: String
  - str2: String

  **output**: Boolean

  **source**:

  ```javascript
  function isEquivalent(str1, str2) {
      return isString(str1) && isString(str2) 
          ? str1.toUpperCase()===str2.toUpperCase()
          : false;
  }
  ```

  **description**:

  A function that checks if two strings are equal ignoring their cases. 

  ```javascript
  const {isEquivalent} = require('elegant-standard');
  
  "hello".toUpperCase()==="HellO".toUpperCase(); // prints true
  isEquivalent("hello", "HellO"); // prints true
  isEquivalent("1", 1);           // prints false (both elements have to be strings)
  ```

- ### isSimilar

  **arguments**:

  - element1: String or Number
  - element2: String or Number

  **output**: Boolean

  **source**:

  ```javascript
  function isSimilar(_element1, _element2){
      var element1 = isNumber(_element1) ? String(_element1) : _element1;
      var element2 = isNumber(_element2) ? String(_element2) : _element2;
      return isString(element1) && isString(element2) 
          ? element1.toUpperCase()===element2.toUpperCase()
          : false; 
  }
  ```

  **description**:

  A function that does the same thing as `isEquivalent` but also checks if any number passed matches the other string value when converted. (Needless to say you can also compare just numbers, though it isn't recommended)

  ```javascript
  const {isSimilar} = require('elegant-standard');
  
  "hello".toUpperCase()==="HellO".toUpperCase(); // prints true
  isSimilar("hello", "HellO"); // prints true
  isSimilar("1", 1);           // prints true
  isSimilar(1, 1)              // prints true (Recommended just use 1===1 instead)
  ```

- ### isEmail

  **arguments**

  - element: String

  **output**: Boolean

  **source**:

  ```javascript
  function isEmail(element) {
      return isString(element) ? /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(el) : false;
  }
  ```

  **description**:

  A function that checks if a string matches the format "placeholder@placeholder.placeholder":-

  ```javascript
  const {isEmail} = require('elegant-standard');
  
  /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test("nsakhilesh02@gmail.com") // prints true
  isEmail("nsakhilesh02@gmail.com")       // prints true
  ```

- ### contains

  **arguments**

  - element1: String or Array
  - element2: Any

  **output**: Boolean

  **source**:

  ```javascript
  function contains(element1, element2) {
      if (isString(element1) && isString(element2)) {
          return element1.toUpperCase().includes(element2.toUpperCase());
      }
      
      if (isArray(element1)) {
          var el2 = isString(element2) ? element2.toUpperCase() : element2;
          for (let i=0; i<element1.length; i++) {
          	var el1 = isString(element1[i]) ? element1[i].toUpperCase() : element1[i];
              if (el1===el2) {
                  return true;
              }
          }
      }
      return false;
  }
  ```

  **description**:

  Checks if a string exists inside another string or if an item exists in an array while ignoring cases. 

  ```javascript
  const {contains} = require('elegant-standard');
  
  contains("hello", "HELL")        // prints true
  contains(["foo","bar"], "FOO")   // prints true
  contains(["foo","bar"], "FOO")   // prints true
  contains([1, "hello"], "HELLO")  // prints true
  contains([1, 2], 1);             // prints true
  contains(["hello"], "HELL")      // prints false
  ```

- ### test

  **arguments**:

  - str: String
  - re: RegExp
  
  **output**: Boolean
  
  **source**:
  
  ```javascript
  function test(str, re) {
      return isString(str) && isRegExp(re) && re.test(str);
  }
  ```
  
  **description**:
  
  While JavaScript regular expressions can perform tests as well, they also allow for testing of numbers:-
  
  ```javascript
  /12/i.test(12); // prints true
  ```
  
  Some developers might want to avoid this, and only want to test strings, the `test` function does exactly this:-
  
  ```javascript
  const {test} = require('elegant-standard');
  
  test(12, /12/i);   // prints false
  test("12", /12/i); // prints true
  ```

- ### oneOf
  
  **arguments**
  
  - str: String
  - arr: Array of regular expressions
  
  **output**: Boolean
  
  **source**:
  
  ```javascript
  function oneOf(str, arr) {
      if (!isString(str)) {
          return false;
      }
      
      if (isArray(arr)) {
          for (let i=0; i<arr.length; i++) {
              if (isRegExp(arr[i]) && arr[i].test(str)) {
                  return true;
              } else if (isString(arr[i]) && arr[i]===str) {
                  return true;
              }
          }
      }
      return false;
  }
  ```
  
  **description**: 
  
  A function that checks if a string passes one of an array of regular expression tests or is equal to one of the strings in the array:-
  
  ```javascript
  const {oneOf} = require('elegant-standard');
  
  oneOf("hello", ["hello", "world"]);        // prints true
  oneOf("hello", [/world/i, /hell/i]);       // prints true
  oneOf("hello world", [/world/i, /hell/i]); // prints true
  ```
  
- ### allOf
  
  **arguments**
  
  - str: String
  - arr: Array of regular expressions
  
  **output**: Boolean
  
  **source**:
  
  ```javascript
  function allOf(str, arr) {
    if (!isString(str) || !isUArray(arr)) {
        return false;
    }
    var matchesAll = 0;
      
     for (var i = 0; i < arr.length; i++) {
       if (isRegExp(arr[i]) && arr[i].test(str)) {
         matchesAll += 1;
       } else if (isString(arr[i]) && arr[i] === str) {
         matchesAll += 1;
       }
     }
  
    return matchesAll === arr.length;
  };
  ```
  
  **description**: 
  
  A function that checks if a string passes all of an array of regular expression tests or is equal to all the strings in an array:-
  
  ```javascript
  const {allOf} = require('elegant-standard');
  
  allOf("hello", ["hello", "world"]);        // prints false
  allOf("hello", [/world/i, /hell/i]);       // prints false
  allOf("hello world", [/world/i, /hell/i]); // prints true
  ```
  
- ### get

  **arguments**: 

  - arr: Array

  - index: Number

  - default: Any

  **output**: Item in Array
  
  **source**
  
  ```javascript
  function get(arr, index, def) {
      return !isNumber(index) ? 
        def !== undefined && def !== null ? def : 
        null : 
        index < arr.length && index >= 0 ? arr[index] : 
        def !== undefined && def !== null ? def : 
        null;
  }
  ```
  
  **description**:
  
  A function that elegantly gets items from an array. (if an index is out of the range of the array, it will return a default value or null)
  
  ```javascript
  const {get} = require('elegant-standard');
  
  let arr = [1, 2, 3];
  arr[3]; // Error: Crash
  get(arr, 3); // returns null
  get(arr, 3, -1); // returns -1
  ```

## The Rules

Coming soon...

## License

This library is licensed under the MIT License - check the [LICENSE](https://github.com/AkhileshNS/elegant-standard/blob/master/LICENSE) file for more details.
