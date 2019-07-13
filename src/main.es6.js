// External Modules
import cloneDeep from 'lodash.clonedeep';

/*
  Common Functions
  ================
*/

/*
  A function to extract the type of an element using Object.prototype.toString.call(element)
*/
export const type = el => Object.prototype.toString.call(el).split(" ")[1].slice(0, -1).toLowerCase();
export const define = (el, def) => 
  (el!==undefined && el!==null) ? el :
  (def!==undefined && def!==null) ? def :
  []
export const check = (el, Type, def) => 
  type(el)===Type ? el : 
  Type==="array" ? [] :
  Type==="object" ? {} :
  def!==undefined && def!==null ? def :
  null;

/*
  String functions
  ================
*/
export const isString = el => type(el)==="string";
export const isUnemptyString = el => isString(el) && el!=="";
export const isUString = isUnemptyString;
export const isSame = (str1, str2) => 
  isString(str1) && isString(str2) ? str1.toUpperCase()===str2.toUpperCase() : false;
export const contains = (str1, str2) => 
  isString(str1) && isString(str2) ? str1.toUpperCase().includes(str2.toUpperCase()) : false;

/*
  Boolean functions
  =================
*/
export const isBoolean = el => type(el)==="boolean";
export const isEmail = el => /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(el);
export const test = (el, regex) => isUString(el) && type(regex)==="regexp" ? regex.test(el) : false;
export const oneOf = (el, arr) => {
  if (isUArray(arr)) {
    for (let i=0; i<arr.length; i++) {
      if (type(arr[i])==="regexp" && arr[i].test(el)) {
        return true;
      } else if (isString(arr[i]) && arr[i]===el) {
        return true;
      }
    }
  }

  return false;
}
export const allOf = (el, arr) => {
  let matchesAll = 0;

  if (isUArray(arr)) {
    for (let i=0; i<arr.length; i++) {
      if (type(arr[i])==="regexp" && arr[i].test(el)) {
        matchesAll += 1;
      } else if (isString(arr[i]) && arr[i]===el) {
        matchesAll += 1;
      }
    }
  }

  return matchesAll===arr.length;
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
  (def!==undefined && def!==null) ? def :
  null : 
  (index < arr.length && index >= 0) ? arr[index] : 
  (index < 0 && index >= -arr.length) ? arr[arr.length + index] : 
  (def !== undefined && def !== null) ? def : 
  null;

/*
  Higher-Order Functions
  ======================
*/
/* a HOC to declare Pass By Value Functions */
export const passByValue = func => {
  return function() {
    let params = [];
    for (let i=0; i<arguments.length; i++) {
      let argument = arguments[i];
      params.push(
        oneOf(type(argument), [/object/i, /array/i]) ? 
        cloneDeep(argument) : 
        argument
      );
    }
    func(...params);
  } 
}

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