"use strict";

// External Modules
import cloneDeep from 'lodash.clonedeep';

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
export var type = function type(el) {
  return Object.prototype.toString.call(el).split(" ")[1].slice(0, -1).toLowerCase();
};

export var define = function define(el, def) {
  return el !== undefined && el !== null ? el : def !== undefined && def !== null ? def : [];
};
/*
  String functions
  ================
*/


export var isString = function isString(el) {
  return type(el) === "string";
};

export var isUnemptyString = function isUnemptyString(el) {
  return isString(el) && el !== "";
};

export var isUString = isUnemptyString;
/*
  Boolean functions
  =================
*/

export var isBoolean = function isBoolean(el) {
  return type(el) === "boolean";
};

export var isEmail = function isEmail(el) {
  return /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(el);
};

export var test = function test(el, regex) {
  return isUString(el) && type(regex) === "regexp" ? regex.test(el) : false;
};

export var oneOf = function oneOf(el, arr) {
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

export var allOf = function allOf(el, arr) {
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

export var isDayOfWeek = function isDayOfWeek(el) {
  return oneOf(el, [/monday/i, /tuesday/i, /wednesday/i, /thursday/i, /friday/i, /saturday/i, /sunday/i]) || oneOf(el, [/mon/i, /tues/i, /wed/i, /thurs/i, /fri/i, /sat/i, /sun/i]);
};
/*
  Numerical Functions 
  =================== 
*/


export var isNumber = function isNumber(el) {
  return type(el) === "number";
};
/*
  Object Functions
  ================
*/


export var isObject = function isObject(el) {
  return type(el) === "object";
};

export var isUnemptyObject = function isUnemptyObject(el) {
  return isObject(el) && Object.entries(el).length > 0;
};

export var isUObject = isUnemptyObject;
/*
  Array Functions
  ===============
*/

export var isArray = function isArray(el) {
  return type(el) === "array";
};

export var isUnemptyArray = function isUnemptyArray(el) {
  return isArray(el) && el.length > 0;
};

export var isUArray = isUnemptyArray;

export var get = function get(arr, index, def) {
  return !isNumber(index) ? def !== undefined && def !== null ? def : null : index < arr.length && index >= 0 ? arr[index] : index < 0 && index >= -arr.length ? arr[arr.length + index] : def !== undefined && def !== null ? def : null;
};
/*
  Higher-Order Functions
  ======================
*/

/* a HOC to declare Pass By Value Functions */
export var passByValue = function passByValue(func) {
  return function () {
    var params = [];

    for (var i = 0; i < arguments.length; i++) {
      var value = i < 0 || arguments.length <= i ? undefined : arguments[i];
      params.push(oneOf(type(value), [/object/i, /array/i]) ? cloneDeep(value) : value);
    }

    func.apply(void 0, params);
  };
};
/* A HOC that maps the default inject function: stores => {} [Object that will be passed as props]
   Ex: i/p - { trigger: "appStore" }
       o/p - { trigger: stores.appStore.trigger } */


export var derive = function derive(mapping) {
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