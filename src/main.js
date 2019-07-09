/*
  A closure that maps the default inject function: stores => {} [Object that will be passed as props]
  Ex: i/p - { trigger: "appStore" }
      o/p - { trigger: stores.appStore.trigger }
*/
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

/*
  A function to extract the type of an element using Object.prototype.toString.call(element)
*/
export const type = el => Object.prototype.toString.call(el).split(" ")[1].slice(0, -1).toLowerCase();

export const isString = el => type(el)==="string";
export const isUnemptyString = el => isString(el) && el!=="";
export const isBoolean = el => type(el)==="boolean";
export const isNumber = el => type(el)==="number";
export const isObject = el => type(el)==="object";
export const isUnemptyObject = el => isObject(el) && Object.entries(el).length>0;
export const isArray = el => type(el)==="array";
export const isUnemptyArray = el => isArray(el) && el.length>0;
export const isEmail = el => /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(el);
export const test = (regex, el) => {
  if (isUnemptyString(el)) {
    return regex.test(el);
  }
  return false;
}
export const oneOf = (el, arr) => {
  if (isUnemptyArray(arr)) {
    for (let i=0; i<arr.length; i++) {
      if (arr[i].test(el)) {
        return true;
      }
    }
  }

  return false;
}
export const isDayOfWeek = el => 
  oneOf(el, [/monday/i,/tuesday/i,/wednesday/i,/thursday/i,/friday/i,/saturday/i,/sunday/i]);