const {
  type, // 1 
  define, // 2 
  check, // 3 
  isString, // 4 
  isUString, // 5 
  isBoolean, // 6 
  isNumber, // 7 
  isRegExp, // 8 
  isEmail, // 9 
  isObject, // 10
  isUObject, // 11
  isArray, // 12
  isUArray, // 13
  isEquivalent, // 14
  isSimilar, // 15
  contains, // 16
  test, // 17
  oneOf, // 18
  allOf, // 19
  get, //20
} = require('../src/main');

describe("elegant-standard", () => {
  it("should be better alternative to JavaScript's typeof", () => {
    expect(type("foo")==="string").toBeTruthy();
    expect(type(1)==="number").toBeTruthy();
    expect(type(true)==="boolean").toBeTruthy();
    expect(type(null)==="null").toBeTruthy();
    expect(type(/foo/)==="regexp").toBeTruthy();
    expect(type({})==="object").toBeTruthy();
    expect(type([])==="array").toBeTruthy();
    expect(type()==="undefined").toBeTruthy();
    expect(type(function() {})==="function").toBeTruthy();
  });

  it("should handle undefined and null", () => {
    expect(define(null, "")==="").toBeTruthy();
    expect(define("", null)==="").toBeTruthy();
  });

  it("should check if an element is a specified type and to return a default if it isn't", () => {
    expect(check(null, "string", "hello")==="hello").toBeTruthy();
    expect(check({foo: "bar"}, "object")).toEqual({foo: "bar"});
    expect(check(null)).toEqual([]);
    expect(check("str","number")===null).toBeTruthy();
  });

  it('should check if an element is a String', () => {
    expect(isString("")).toBeTruthy();
  });

  it("should check if an element is a String and if it isn't empty", () => {
    expect(isUString("")).toBeFalsy();
    expect(isUString("foo")).toBeTruthy();
  });

  it('should check if an element is a Boolean', () => {
    expect(isBoolean(false)).toBeTruthy();
  });

  it('should check if an element is a Number', () => {
    expect(isNumber(-1)).toBeTruthy();
  });

  it('should check if an element is a RegExp', () => {
    expect(isRegExp(/re/)).toBeTruthy();
  });

  it('should check if an element is a String of format "placeholder@placeholder.placeholder"', () => {
    expect(isEmail("AkhileshNS")).toBeFalsy();
    expect(isEmail("nsakhilesh02@gmail.com")).toBeTruthy();
  });

  it('should check if an element is an Object', () => {
    expect(isObject({})).toBeTruthy();
  });

  it('should check if an element is an Object and has properties', () => {
    expect(isUObject({})).toBeFalsy();
    expect(isUObject({foo: "bar"})).toBeTruthy();
  });

  it('should check if an element is an Array', () => {
    expect(isArray([])).toBeTruthy();
  });

  it("should check if an element is an Array and isn't empty", () => {
    expect(isUArray([])).toBeFalsy();
    expect(isUArray(["foo", "bar"])).toBeTruthy();
  });

  it('should check if two strings are equal while ignoring case', () => {
    expect(isEquivalent("hello","HELLO")).toBeTruthy();
    expect(isEquivalent("1", 1)).toBeFalsy();
  })

  it('should check if two strings or a string and a number are equivalent', () => {
    expect(isSimilar("hello","HELLO")).toBeTruthy();
    expect(isSimilar("1", 1)).toBeTruthy();
  })

  it('shuld do what includes does while ignoring case', () => {
    expect(contains("hello", "HELL")).toBeTruthy();      
    expect(contains(["foo","bar"], "FOO")).toBeTruthy(); 
    expect(contains(["foo","bar"], "FOO")).toBeTruthy(); 
    expect(contains([1, "hello"], "HELLO")).toBeTruthy();
    expect(contains([1, 2], 1)).toBeTruthy();          
    expect(contains(["hello"], "HELL")).toBeFalsy();
  })

  it('should do what .test() does while ignoring numbers', () => {
    expect(test(12, /12/i)).toBeFalsy();
    expect(test("12", /12/i)).toBeTruthy();
  })

  it('should allow for running multiple regex tests or string comparisons on a single string and seeing if it passes atleast one of them', () => {
    expect(oneOf("hello", ["hello", "world"])).toBeTruthy();
    expect(oneOf("hello", [/world/i, /hell/i])).toBeTruthy();
    expect(oneOf("hello world", [/world/i, /hell/i])).toBeTruthy();
  })

  it('should allow for running multiple regex tests or string comparisons on a single string and seeing if it passes all of them', () => {
    expect(allOf("hello", ["hello", "world"])).toBeFalsy();
    expect(allOf("hello", [/world/i, /hell/i])).toBeFalsy();
    expect(allOf("hello world", [/world/i, /hell/i])).toBeTruthy();
  })

  it('should elegantly retrieve items in an array', () => {
    let arr = [1, 2, 3];
    expect(get(arr, 3)===null).toBeTruthy();
    expect(get(arr, 3, -1)===-1).toBeTruthy();
  })
})