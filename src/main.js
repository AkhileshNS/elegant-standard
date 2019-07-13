const cloneDeep = require('lodash.clonedeep');

/*
  Common Functions
  ================
*/

/*
  A function to extract the type of an element using Object.prototype.toString.call(element)
*/
function type(el) {
  return Object.prototype.toString.call(el).split(" ")[1].slice(0, -1).toLowerCase();
};

function define(el, def) {
  return el !== undefined && el !== null ? el : def !== undefined && def !== null ? def : [];
};

function check(el, Type, def) {
  Type = Type===undefined ? "array" : Type;
  return type(el) === Type ? el : 
    Type === "array" ? [] : 
    Type === "object" ? {} : 
    def !== undefined && def !== null ? def : 
    null;
};

function contains(el1, el2) {
  if (isString(el1) && isString(el2)) {
    return el1.toUpperCase().includes(el2.toUpperCase());
  }

  if (isArray(el1) && isString(el2)) {
    for (var i = 0; i < el1.length; i++) {
      if (isString(el1[i]) && el1[i].toUpperCase() === el2.toUpperCase()) {
        return true;
      }
    }
  }

  if (isArray(el1) && !isString(el2)) {
    return el1.includes(el2);
  }

  return false;
};

/*
  String functions
  ================
*/
function isString(el) {
  return type(el) === "string";
};

function isUnemptyString(el) {
  return isString(el) && el !== "";
};
var isUString = isUnemptyString;

function isSame(str1, str2) {
  return isString(str1) && isString(str2) ? str1.toUpperCase()===str2.toUpperCase() : false;
}

/*
  Boolean functions
  =================
*/

function isBoolean(el) {
  return type(el) === "boolean";
};

function isEmail(el) {
  return /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(el);
};

function test(el, regex) {
  return isUString(el) && type(regex) === "regexp" ? regex.test(el) : false;
};

function oneOf(el, arr) {
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

function allOf(el, arr) {
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

function isDayOfWeek(el) {
  return oneOf(el, [/monday/i, /tuesday/i, /wednesday/i, /thursday/i, /friday/i, /saturday/i, /sunday/i]) 
  || oneOf(el, [/mon/i, /tues/i, /wed/i, /thurs/i, /fri/i, /sat/i, /sun/i]);
};

/*
  Numerical Functions 
  =================== 
*/

function isNumber(el) {
  return type(el) === "number";
};

/*
  Object Functions
  ================
*/

function isObject(el) {
  return type(el) === "object";
};

function isUnemptyObject(el) {
  return isObject(el) && Object.entries(el).length > 0;
};
var isUObject = isUnemptyObject;

/*
  Array Functions
  ===============
*/

function isArray(el) {
  return type(el) === "array";
};

function isUnemptyArray(el) {
  return isArray(el) && el.length > 0;
};
var isUArray = isUnemptyArray;

function get(arr, index, def) {
  return !isNumber(index) ? 
  def !== undefined && def !== null ? def : 
  null : 
  index < arr.length && index >= 0 ? arr[index] : 
  index < 0 && index >= -arr.length ? arr[arr.length + index] : 
  def !== undefined && def !== null ? def : 
  null;
};

/*
  Higher-Order Functions
  ======================
*/

/* a HOC to declare Pass By Value Functions */
function passByValue(func) {
  return function () {
    var params = [];

    for (var i = 0; i < arguments.length; i++) {
      var value = arguments[i];
      params.push(
        oneOf(type(value), [/object/i, /array/i]) ? 
        cloneDeep(value) : 
        value
      );
    }

    func.apply(void 0, params);
  };
};

/* A HOC that maps the default inject function: stores => {} [Object that will be passed as props]
   Ex: i/p - { trigger: "appStore" }
       o/p - { trigger: stores.appStore.trigger } */
function derive(mapping) {
  return function (stores) {
    var res = null;

    for (var key in mapping) {
      var storeName = mapping[key];
      var storeKey = key;

      if (storeName.includes('.')) {
        let NameAndKey = storeName.split('.');
        storeName = NameAndKey[0];
        storeKey = NameAndKey[1];
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

module.exports = {
  // Common Functions
  type, define, check, contains,

  // String Functions
  isString, isUnemptyString, isUString, isSame, 

  // Boolean Functions
  isBoolean, test, oneOf, allOf, isEmail, isDayOfWeek,
  
  // Numerical Functions
  isNumber,

  // Object Functions
  isObject, isUnemptyObject, isUObject,

  // Array Functions
  isArray, isUnemptyArray, isUArray, get,

  // Higher Order Functions
  passByValue, derive
};