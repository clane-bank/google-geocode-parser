"use strict";

var _require = require('./lib/'),
    suffixList = _require.suffixList,
    suffixes = _require.suffixes,
    directionals = _require.directionals,
    directionalList = _require.directionalList;

function normalize(name, list) {
  return list.find(function (item) {
    return item.options.includes(name);
  });
}

function findType(name, i) {
  var suffixIdentified = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (directionalList.includes(name)) {
    var normalizedDirectional = normalize(name, directionals);

    if (i === 0) {
      return {
        type: 'postdirectional',
        longName: normalizedDirectional.name,
        shortName: normalizedDirectional.output
      };
    } else {
      return {
        type: 'predirectional',
        longName: normalizedDirectional.name,
        shortName: normalizedDirectional.output
      };
    }
  }

  if (suffixList.includes(name)) {
    var normalizedSuffix = normalize(name, suffixes);

    if (!suffixIdentified) {
      return {
        type: 'suffix',
        longName: normalizedSuffix.name,
        shortName: normalizedSuffix.output
      };
    }

    if (suffixIdentified && normalizedSuffix.name !== name) {
      return {
        type: 'streetName',
        name: normalizedSuffix.name,
        replacedName: name
      };
    }
  }

  return {
    type: 'streetName',
    name: name
  };
}

function identify(routes, type) {
  if (!routes) {
    return null;
  }

  var splitRoute = routes.split(' ');
  var suffixIdentified = false;
  var parsedRoute = splitRoute.reverse().map(function (name, i) {
    var data = findType(name, i, suffixIdentified);

    if (data.type === 'suffix') {
      suffixIdentified = true;
    }

    return data;
  });
  var identifiedData = parsedRoute.find(function (route) {
    return route.type === type;
  });
  return identifiedData || null;
}

function checkSuffix(routes) {
  return identify(routes, 'suffix');
}

function checkPredirectional(routes) {
  return identify(routes, 'predirectional');
}

function checkPostdirectional(routes) {
  return identify(routes, 'postdirectional');
}

function checkStreetName(routes) {
  return identify(routes, 'streetName');
}

function parseRoute(route) {
  if (route) {
    return {
      predirectional: checkPredirectional(route),
      postdirectional: checkPostdirectional(route),
      suffix: checkSuffix(route),
      streetName: checkStreetName(route)
    };
  }

  return null;
}

module.exports = {
  parseRoute: parseRoute
};