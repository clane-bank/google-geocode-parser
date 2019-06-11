"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function filterType(data, types) {
  var _loop = function _loop(i) {
    if (data.types.find(function (propertyType) {
      return propertyType === types[i];
    })) {
      return {
        v: true
      };
    }
  };

  for (var i = 0; i < types.length; i += 1) {
    var _ret = _loop(i);

    if (_typeof(_ret) === "object") return _ret.v;
  }

  return false;
}

function filterComponents(components, key) {
  var useShort = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (components.length === 0 || Object.keys(components).length === 0 && components.constructor === Object) {
    return null;
  }

  var component = components.find(function (component) {
    return component.types.find(function (type) {
      return type === key;
    });
  }) || null;

  if (component) {
    return getTextFromComponent(component, useShort);
  }

  return component;
}

function getTextFromComponent() {
  var component = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var short = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (!component) {
    return null;
  }

  return short ? component.short_name : component.long_name;
}

module.exports = {
  filterType: filterType,
  filterComponents: filterComponents
};