/*
  Common Functions
  ================
*/

/*
  A function to extract the type of an element using Object.prototype.toString.call(element)
*/
export const type = el => Object.prototype.toString.call(el).split(" ")[1].slice(0, -1).toLowerCase();
const Type = type;
export const define = (el, def) => 
  (el!==undefined && el!==null) ? el :
  (def!==undefined && def!==null) ? def :
  []
export const check = (el, type, def) => {
  type = !isString(type) ? "array" : type.toLowerCase();
  return (
  	Type(el)===type ? el :
    def!==undefined && def!==null ? def :
    type==="object" ? {} : 
    type==="array" ? [] :
    null
  );
}
export const contains = (element1, element2) => {
  if (isString(element1) && isString(element2)) {
    return element1.toUpperCase().includes(element2.toUpperCase());
  }
  
  if (isArray(element1)) {
    let el2 = isString(element2) ? element2.toUpperCase() : element2;
    for (let i=0; i<element1.length; i++) {
      let el1 = isString(element1[i]) ? element1[i].toUpperCase() : element1[i];
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
export const isString = el => type(el)==="string";
export const isUnemptyString = el => isString(el) && el!=="";
export const isUString = isUnemptyString;
export const isEquivalent = (str1, str2) => 
  isString(str1) && isString(str2) 
  ? str1.toUpperCase()===str2.toUpperCase()
  : false
export const isSimilar = (element1, element2) => {
  let _element1 = isNumber(element1) ? String(element1) : element1;
  let _element2 = isNumber(element2) ? String(element2) : element2;
  return isString(_element1) && isString(_element2) 
    ? _element1.toUpperCase()===_element2.toUpperCase()
    : false;
}

/*
  Boolean functions
  =================
*/
export const isBoolean = el => type(el)==="boolean";
export const isRegExp = el => type(el)==="regexp";
export const isEmail = el => isString(el) && /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(el);
export const test = (el, regex) => isUString(el) && isRegExp(regex) ? regex.test(el) : false;
export const oneOf = (str, arr) => {
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
export const allOf = (str, arr) => {
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
}
export const isDayOfWeek = el => 
  oneOf(el, [/monday/i,/tuesday/i,/wednesday/i,/thursday/i,/friday/i,/saturday/i,/sunday/i]) ||
  oneOf(el, [/mon/i,/tues/i,/wed/i,/thurs/i,/fri/i,/sat/i,/sun/i]);

/*
  Numerical Functions 
  =================== 
*/
export const isNumber = el => type(el)==="number";

/*
  Object Functions
  ================
*/
export const isObject = el => type(el)==="object";
export const isUnemptyObject = el => isObject(el) && Object.entries(el).length>0;
export const isUObject = isUnemptyObject;

/*
  Array Functions
  ===============
*/
export const isArray = el => type(el)==="array";
export const isUnemptyArray = el => isArray(el) && el.length>0;
export const isUArray = isUnemptyArray;
export const get = (arr, index, def) => 
  !isNumber(index) ? 
  def !== undefined && def !== null ? def : 
  null : 
  index < arr.length && index >= 0 ? arr[index] : 
  def !== undefined && def !== null ? def : 
  null;

/*
  Higher-Order Functions
  ======================
*/

/* A HOC that maps the default inject function: stores => {} [Object that will be passed as props]
   Ex: i/p - { trigger: "appStore" }
       o/p - { trigger: stores.appStore.trigger } */
export const derive = mapping => stores => {
  let res = null;
  for (let key in mapping) {
    let storeName = mapping[key];
    let storeKey = key;
    if (storeName.includes('.')) {
      let [name, newKey] = storeName.split('.');
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