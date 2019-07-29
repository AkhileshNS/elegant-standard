/*
  Common Functions
  ================
*/

/*
  A function to extract the type of an element using Object.prototype.toString.call(element)
*/
function type(element) {
  return Object.prototype.toString.call(element).split(" ")[1].slice(0,  -1).toLowerCase();
}
var Type = type;

function define(el, def) {
  return (
    el !== undefined && el !== null ? el : 
  	def !== undefined && def !== null ? def : 
  	[]
  );
};

function check(el, type, def) {
  type = Type(type)!=="string" ? "array" : type.toLowerCase();
  return (
  	Type(el)===type ? el :
    def!==undefined && def!==null ? def :
    type==="object" ? {} : 
    type==="array" ? [] :
    null
  );
};

function contains(element1, element2) {
  if (isString(element1) && isString(element2)) {
    return element1.toUpperCase().includes(element2.toUpperCase());
  }
  
  if (isArray(element1)) {
    var el2 = isString(element2) ? element2.toUpperCase() : element2;
    for (var i=0; i<element1.length; i++) {
      var el1 = isString(element1[i]) ? element1[i].toUpperCase() : element1[i];
      if (el1===el2) {
        return true;
      }
    }
  }

  return false;
}

/*
  String functions
  ================
*/
function isString(element) {
  return type(element) === "string";
};

function isUnemptyString(element) {
  return isString(element) && element !== "";
};
var isUString = isUnemptyString;

function isEquivalent(str1, str2) {
  return isString(str1) && isString(str2) 
    ? str1.toUpperCase()===str2.toUpperCase()
    : false;
}

function isSimilar(element1, element2){
  var _element1 = isNumber(element1) ? String(element1) : element1;
  var _element2 = isNumber(element2) ? String(element2) : element2;
  return isString(_element1) && isString(_element2) 
    ? _element1.toUpperCase()===_element2.toUpperCase()
    : false;
}

/*
  Boolean functions
  =================
*/

function isBoolean(element) {
  return type(element) === "boolean";
};

function isRegExp(element) {
  return type(element) === "regexp";
} 

function isEmail(element) {
  return isString(element) ? /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(element) : false;
}

function test(element, regex) {
  return isUString(element) && type(regex) === "regexp" ? regex.test(element) : false;
};

function oneOf(str, arr) {
  if (!isString(str)) {
    return false;
  }
  
  if (isArray(arr)) {
    for (var i=0; i<arr.length; i++) {
      if (isRegExp(arr[i]) && arr[i].test(str)) {
        return true;
      } else if (isString(arr[i]) && arr[i]===str) {
        return true;
      }
    }
  }
  return false;
}

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
    def !== undefined && def !== null ? def : 
    null;
}

/*
  Higher-Order Functions
  ======================
*/

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
        var NameAndKey = storeName.split('.');
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
  isString, isUnemptyString, isUString, isEquivalent, isSimilar, 

  // Boolean Functions
  isBoolean, test, oneOf, allOf, isEmail, isDayOfWeek, isRegExp, 
  
  // Numerical Functions
  isNumber,

  // Object Functions
  isObject, isUnemptyObject, isUObject,

  // Array Functions
  isArray, isUnemptyArray, isUArray, get,

  // Higher Order Functions
  derive
};