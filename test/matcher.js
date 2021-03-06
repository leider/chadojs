'use strict';
var expect = require('must');
var any = require('../lib/types').any;
var anyValue = require('../lib/types').anyValue;
var lib = require('../lib/matcher');
var createMatcher = lib.createMatcher;
var getArgumentsAsArray = require('../lib/arguments_helper').getArgumentsAsArray;

function create() {
  return createMatcher(getArgumentsAsArray(arguments));
}

function findMatcher(matchers) {
  return lib.findMatcher(matchers, Array.prototype.slice.call(arguments, 1));
}

describe('library matcher', function () {
  it('findMatcher called with no matcher returns undefined', function () {
    expect(findMatcher([], 1)).to.be(undefined);
    expect(findMatcher(undefined, 1)).to.be(undefined);
  });
  describe('findMatcher with exact simple values', function () {
    it('returns matching matcher for one argument', function () {
       var matcher = create(1);
       expect(findMatcher(matcher, 1)).to.be(matcher);
       matcher = create(2);
       expect(findMatcher(matcher, 2)).to.be(matcher);
    });
    it('returns undefined when no match found', function () {
      expect(findMatcher(create(1), 2)).to.be(undefined);
    });
    it('returns matching matcher for two arguments', function () {
      var matcher = create(1, 'aString');
      expect(findMatcher(matcher, 1, 'aString')).to.be(matcher);
    });
    it('returns undefined when second argument doesn\'t match', function () {
      expect(findMatcher(create(1, 'aString'), 1, 'anotherString')).to.be(undefined);
    });
    it('returns undefined when args has less arguments than expected', function () {
      expect(findMatcher(create(1, 2), 1)).to.be(undefined);
    });
    it('given two matchers, returns the matching matcher', function () {
      var matchers = [create(1), create(2)];
      expect(findMatcher(matchers, 1)).to.be(matchers[0]);
      expect(findMatcher(matchers, 2)).to.be(matchers[1]);
    });
  });
  describe('findMatcher with no value', function () {
    it('returns matcher for no arguments', function () {
      var matcher = create();
      expect(findMatcher(matcher)).to.be(matcher);
      expect(findMatcher(matcher, undefined)).to.be(matcher);
      matcher = create(undefined);
      expect(findMatcher(matcher)).to.be(matcher);
      expect(findMatcher(matcher, undefined)).to.be(matcher);
    });
  });
  describe('findMatcher with object values', function () {
    it('returns matching matcher for one argument', function () {
      var object = {1: 'one'};
      var matcher = create(object);
      expect(findMatcher(matcher, object)).to.be(matcher);
      expect(findMatcher(matcher, {1: 'one'})).to.be(matcher);
    });
  });
  describe('findMatcher with anyValues', function () {
    it('returns matching matcher for any value', function () {
      var matcher = create(anyValue);
      expect(findMatcher(matcher, 1)).to.be(matcher);
      expect(findMatcher(matcher, 'aString')).to.be(matcher);
    });
    it('returns undefined when called with more args than matcher expects', function () {
      expect(findMatcher(create(anyValue), 1, 2)).to.be(undefined);
    });
    it('returns matcher when called with less args than expected, but expected args are anyValue', function () {
      var matcher = create(anyValue, anyValue);
      expect(findMatcher(matcher, 1)).to.be(matcher);
    });
  });
  describe('findMatcher with any', function () {
    it('returns matching matcher for any', function () {
      var matcher = create(any);
      expect(findMatcher(matcher, 1)).to.be(matcher);
      expect(findMatcher(matcher, 'aString')).to.be(matcher);
    });
    it('returns matcher when called with more args than matcher expects', function () {
      var matcher = create(any);
      expect(findMatcher(matcher, 1, 2)).to.be(matcher);
    });
  });
  describe('findMatcher with different types of matchers', function () {
    it('returns the most specific matcher', function () {
      var matchers = [create(any), create(anyValue, anyValue), create('aString', 1)];
      expect(findMatcher(matchers, 'aString', 1)).to.be(matchers[2]);
      expect(findMatcher(matchers, 'aString')).to.be(matchers[1]);
      expect(findMatcher(matchers, 'aString', 1, 2)).to.be(matchers[0]);
      expect(findMatcher(matchers)).to.be(matchers[1]);
    });
  });
});
