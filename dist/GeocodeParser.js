"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./utils/index'),
    parseRoute = _require.parseRoute,
    filterType = _require.filterType,
    filterComponents = _require.filterComponents;
/**
 * We are parsing raw data from the google geocode API
 * These data objects must mimic what is provided as a
 * response from Google APIs (see __mocks__)
 */


function __internals_get_results() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _ref = data || {},
      _ref$results = _ref.results,
      results = _ref$results === void 0 ? null : _ref$results,
      _ref$status = _ref.status,
      status = _ref$status === void 0 ? null : _ref$status;

  if (status !== 'OK') {
    return null;
  }

  return results ? results[0] : null;
}

var GeocodeParser =
/*#__PURE__*/
function () {
  function GeocodeParser() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, GeocodeParser);

    this.data = __internals_get_results(data);
    this.parsedRoute = parseRoute(this.getStreetAddress(true));
  }

  _createClass(GeocodeParser, [{
    key: "sanitizeStreetName",
    value: function sanitizeStreetName(str) {
      if (!this.parsedRoute.streetName && !this.parsedRoute.streetName.replacedName) {
        return str;
      }

      var _this$parsedRoute$str = this.parsedRoute.streetName,
          replacedName = _this$parsedRoute$str.replacedName,
          name = _this$parsedRoute$str.name;
      return str.replace(replacedName, name);
    }
  }, {
    key: "getComponent",
    value: function getComponent(key) {
      var useShort = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (!this.data) {
        return null;
      }

      return filterComponents(this.data.address_components, key, useShort);
    }
  }, {
    key: "isType",
    value: function isType() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (!this.data) {
        return false;
      }

      return filterType(this.data, type);
    }
  }, {
    key: "isCity",
    value: function isCity() {
      return this.isType(['locality', 'sublocality', 'political', 'sublocality_level_1', 'sublocality_level_2', 'sublocality_level_3', 'sublocality_level_4', 'sublocality_level_5']);
    }
  }, {
    key: "isNeighborhood",
    value: function isNeighborhood() {
      return this.isType(['neighborhood']);
    }
  }, {
    key: "isAddress",
    value: function isAddress() {
      return this.isType(['street_address', 'street_number', 'route', 'premise', 'subpremise', 'point_of_interest', 'park', 'airport']);
    }
  }, {
    key: "isAirport",
    value: function isAirport() {
      return this.isType(['airport']);
    }
  }, {
    key: "isState",
    value: function isState() {
      return this.isType(['administrative_area_level_1']);
    }
  }, {
    key: "isCounty",
    value: function isCounty() {
      return this.isType(['administrative_area_level_2']);
    }
  }, {
    key: "isZip",
    value: function isZip() {
      return this.isType(['postal_code']);
    }
  }, {
    key: "getStreetNumber",
    value: function getStreetNumber(useShort) {
      if (!this.isAddress()) {
        return null;
      }

      return this.getComponent('street_number', useShort);
    }
  }, {
    key: "getStreetAddress",
    value: function getStreetAddress(useShort) {
      if (!this.isAddress()) {
        return null;
      }

      if (useShort && this.parsedRoute && this.parsedRoute.streetName && this.parsedRoute.streetName.replacedName) {
        return this.sanitizeStreetName(this.getComponent('route', useShort));
      }

      return this.getComponent('route', useShort);
    }
  }, {
    key: "getCity",
    value: function getCity() {
      var useShort = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      return this.getComponent('locality', useShort) || this.getComponent('sublocality', useShort);
    }
  }, {
    key: "getCountry",
    value: function getCountry() {
      var useShort = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      return this.getComponent('country', useShort);
    }
  },  {
    key: "getCountryCode",
    value: function getCountry() {
      var useShort = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      return this.getComponent('country', useShort);
    }
  },{
    key: "getState",
    value: function getState() {
      var useShort = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      return this.getComponent('administrative_area_level_1', useShort);
    }
  }, {
    key: "getZip",
    value: function getZip() {
      var useShort = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      return this.getComponent('postal_code', useShort);
    }
  }, {
    key: "getNeighborhood",
    value: function getNeighborhood() {
      var useShort = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      return this.getComponent('neighborhood', useShort);
    }
  }, {
    key: "getGeo",
    value: function getGeo() {
      return this.data.geometry;
    }
  }, {
    key: "getSuffix",
    value: function getSuffix() {
      var useShort = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (!this.isAddress() || !this.parsedRoute || !this.parsedRoute.suffix) {
        return null;
      }

      if (useShort) {
        return this.parsedRoute.suffix.shortName;
      }

      return this.parsedRoute.suffix.longName;
    }
  }, {
    key: "getPredirectional",
    value: function getPredirectional() {
      var useShort = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (!this.isAddress() || !this.parsedRoute || !this.parsedRoute.predirectional) {
        return null;
      }

      if (useShort) {
        return this.parsedRoute.predirectional.shortName;
      }

      return this.parsedRoute.predirectional.longName;
    }
  }, {
    key: "getPostdirectional",
    value: function getPostdirectional() {
      var useShort = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (!this.isAddress() || !this.parsedRoute || !this.parsedRoute.postdirectional) {
        return null;
      }

      if (useShort) {
        return this.parsedRoute.postdirectional.shortName;
      }

      return this.parsedRoute.postdirectional.longName;
    }
  }, {
    key: "getStreetName",
    value: function getStreetName() {
      if (!this.isAddress() || !this.parsedRoute || !this.parsedRoute.streetName) {
        return null;
      }

      return this.parsedRoute.streetName.name;
    }
  }, {
    key: "getLat",
    value: function getLat() {
      var geo = this.getGeo();

      if (geo && geo.location) {
        if (typeof geo.location.lat === 'function') {
          return geo.location.lat();
        }

        return geo.location.lat;
      }

      return null;
    }
  }, {
    key: "getLng",
    value: function getLng() {
      var geo = this.getGeo();

      if (geo && geo.location) {
        if (typeof geo.location.lng === 'function') {
          return geo.location.lng();
        }

        return geo.location.lng;
      }

      return null;
    }
  }, {
    key: "getLatLng",
    value: function getLatLng() {
      var lat = this.getLat();
      var lng = this.getLng();

      if (lat && lng) {
        return "".concat(lat, ",").concat(lng);
      }

      return null;
    }
  }, {
    key: "parse",
    value: function parse() {
      return {
        formatted: this.parsedRoute && this.parsedRoute.streetName && this.parsedRoute.streetName.replacedName ? this.sanitizeStreetName(this.data.formatted_address) : this.data.formatted_address,
        address: this.getComponent('street_address'),
        city: this.getComponent('locality') || this.getComponent('sublocality'),
        geometry: this.data.geometry,
        state: this.getComponent('administrative_area_level_1'),
        zip: this.getComponent('postal_code')
      };
    }
  }, {
    key: "isValid",
    get: function get() {
      return this.data ? true : false;
    }
  }]);

  return GeocodeParser;
}();

module.exports = GeocodeParser;