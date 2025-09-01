var _excluded = ["color", "size", "title", "className"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
var NoiseReduction = /*#__PURE__*/forwardRef(function (_ref, ref) {
  var _ref$color = _ref.color,
    color = _ref$color === void 0 ? 'currentColor' : _ref$color,
    _ref$size = _ref.size,
    size = _ref$size === void 0 ? '1em' : _ref$size,
    _ref$title = _ref.title,
    title = _ref$title === void 0 ? null : _ref$title,
    _ref$className = _ref.className,
    className = _ref$className === void 0 ? '' : _ref$className,
    rest = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/React.createElement("svg", _extends({
    ref: ref,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 16 16",
    width: size,
    height: size,
    fill: color,
    className: ['bi', 'bi-noise-reduction', className].filter(Boolean).join(' ')
  }, rest), title ? /*#__PURE__*/React.createElement("title", null, title) : null, /*#__PURE__*/React.createElement("path", {
    d: "M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-1 1a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-1 1a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-1 1a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-1 1a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-1 1a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-1 1a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-1 1a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m1 1a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m.5-.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m1-1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m1-1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m1-1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m1-1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m1-1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m1-1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m-5 7a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m1.5-1.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m1-1a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m1-1a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m1-1a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m1-1a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-3 5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m.5-.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m1-1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m1-1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M1 8a7 7 0 0 1 12.83-3.875.5.5 0 1 0 .15.235q.197.322.359.667a.5.5 0 1 0 .359.932q.201.658.27 1.364a.5.5 0 1 0 .021.282 7 7 0 0 1-.091 1.592.5.5 0 1 0-.172.75 7 7 0 0 1-.418 1.091.5.5 0 0 0-.3.555 7 7 0 0 1-.296.454.5.5 0 0 0-.712.453c0 .111.036.214.098.297a7 7 0 0 1-.3.3.5.5 0 0 0-.75.614 7 7 0 0 1-.455.298.5.5 0 0 0-.555.3 7 7 0 0 1-1.092.417.5.5 0 1 0-.749.172 7 7 0 0 1-1.592.091.5.5 0 1 0-.282-.021 7 7 0 0 1-1.364-.27A.498.498 0 0 0 5.5 14a.5.5 0 0 0-.473.339 7 7 0 0 1-.668-.36A.5.5 0 0 0 5 13.5a.5.5 0 1 0-.875.33A7 7 0 0 1 1 8"
  }));
});
NoiseReduction.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  className: PropTypes.string
};
export default NoiseReduction;