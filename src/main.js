"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.derive = exports.passByValue = exports.get = exports.isUArray = exports.isUnemptyArray = exports.isArray = exports.isUObject = exports.isUnemptyObject = exports.isObject = exports.isNumber = exports.isDayOfWeek = exports.allOf = exports.oneOf = exports.test = exports.isEmail = exports.isBoolean = exports.isUString = exports.isUnemptyString = exports.isString = exports.check = exports.define = exports.type = void 0;

var _lodash = _interopRequireDefault(require("lodash.clonedeep"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/*
  Common Functions
  ================
*/

/*
  A function to extract the type of an element using Object.prototype.toString.call(element)
*/
var type = function type(el) {
  return Object.prototype.toString.call(el).split(" ")[1].slice(0, -1).toLowerCase();
};

exports.type = type;

var define = function define(el, def) {
  return el !== undefined && el !== null ? el : def !== undefined && def !== null ? def : [];
};

exports.define = define;

var check = function check(el, Type, def) {
  return type(el) === Type ? el : Type === "array" ? [] : Type === "object" ? {} : def !== undefined && def !== null ? def : null;
};
/*
  String functions
  ================
*/


exports.check = check;

var isString = function isString(el) {
  return type(el) === "string";
};

exports.isString = isString;

var isUnemptyString = function isUnemptyString(el) {
  return isString(el) && el !== "";
};

exports.isUnemptyString = isUnemptyString;
var isUString = isUnemptyString;
/*
  Boolean functions
  =================
*/

exports.isUString = isUString;

var isBoolean = function isBoolean(el) {
  return type(el) === "boolean";
};

exports.isBoolean = isBoolean;

var isEmail = function isEmail(el) {
  return /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(el);
};

exports.isEmail = isEmail;

var test = function test(el, regex) {
  return isUString(el) && type(regex) === "regexp" ? regex.test(el) : false;
};

exports.test = test;

var oneOf = function oneOf(el, arr) {
  if (isUArray(arr)) {
    for (var i = 0; i < arr.length; i++) {
      if (type(arr[i]) === "regexp" && arr[i].test(el)) {
        return true;
      } else if (isString(arr[i]) && arr[i] === el) {
        return true;
      }
    }
  }

  return false;
};

exports.oneOf = oneOf;

var allOf = function allOf(el, arr) {
  var matchesAll = 0;

  if (isUArray(arr)) {
    for (var i = 0; i < arr.length; i++) {
      if (type(arr[i]) === "regexp" && arr[i].test(el)) {
        matchesAll += 1;
      } else if (isString(arr[i]) && arr[i] === el) {
        matchesAll += 1;
      }
    }
  }

  return matchesAll === arr.length;
};

exports.allOf = allOf;

var isDayOfWeek = function isDayOfWeek(el) {
  return oneOf(el, [/monday/i, /tuesday/i, /wednesday/i, /thursday/i, /friday/i, /saturday/i, /sunday/i]) || oneOf(el, [/mon/i, /tues/i, /wed/i, /thurs/i, /fri/i, /sat/i, /sun/i]);
};
/*
  Numerical Functions 
  =================== 
*/


exports.isDayOfWeek = isDayOfWeek;

var isNumber = function isNumber(el) {
  return type(el) === "number";
};
/*
  Object Functions
  ================
*/


exports.isNumber = isNumber;

var isObject = function isObject(el) {
  return type(el) === "object";
};

exports.isObject = isObject;

var isUnemptyObject = function isUnemptyObject(el) {
  return isObject(el) && Object.entries(el).length > 0;
};

exports.isUnemptyObject = isUnemptyObject;
var isUObject = isUnemptyObject;
/*
  Array Functions
  ===============
*/

exports.isUObject = isUObject;

var isArray = function isArray(el) {
  return type(el) === "array";
};

exports.isArray = isArray;

var isUnemptyArray = function isUnemptyArray(el) {
  return isArray(el) && el.length > 0;
};

exports.isUnemptyArray = isUnemptyArray;
var isUArray = isUnemptyArray;
exports.isUArray = isUArray;

var get = function get(arr, index, def) {
  return !isNumber(index) ? def !== undefined && def !== null ? def : null : index < arr.length && index >= 0 ? arr[index] : index < 0 && index >= -arr.length ? arr[arr.length + index] : def !== undefined && def !== null ? def : null;
};
/*
  Higher-Order Functions
  ======================
*/

/* a HOC to declare Pass By Value Functions */


exports.get = get;

var passByValue = function passByValue(func) {
  return function () {
    var params = [];

    for (var i = 0; i < arguments.length; i++) {
      var value = i < 0 || arguments.length <= i ? undefined : arguments[i];
      params.push(oneOf(type(value), [/object/i, /array/i]) ? (0, _lodash.default)(value) : value);
    }

    func.apply(void 0, params);
  };
};
/* A HOC that maps the default inject function: stores => {} [Object that will be passed as props]
   Ex: i/p - { trigger: "appStore" }
       o/p - { trigger: stores.appStore.trigger } */


exports.passByValue = passByValue;

var derive = function derive(mapping) {
  return function (stores) {
    var res = null;

    for (var key in mapping) {
      var storeName = mapping[key];
      var storeKey = key;

      if (storeName.includes('.')) {
        var _storeName$split = storeName.split('.'),
            _storeName$split2 = _slicedToArray(_storeName$split, 2),
            name = _storeName$split2[0],
            newKey = _storeName$split2[1];

        storeName = name;
        storeKey = newKey;
      }

      if (storeName in stores) {
        if (res === null) {
          res = {};
        }

        res[key] = stores[storeName][storeKey];
      }
    }

    return res;
  };
};

exports.derive = derive;