var _excluded = ["color", "size", "title", "className"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
var Flask = /*#__PURE__*/forwardRef(function (_ref, ref) {
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
    className: ['bi', 'bi-flask', className].filter(Boolean).join(' ')
  }, rest), title ? /*#__PURE__*/React.createElement("title", null, title) : null, /*#__PURE__*/React.createElement("path", {
    d: "M4.5 0a.5.5 0 0 0 0 1H5v5.36L.503 13.717A1.5 1.5 0 0 0 1.783 16h12.434a1.5 1.5 0 0 0 1.28-2.282L11 6.359V1h.5a.5.5 0 0 0 0-1zM10 2H9a.5.5 0 0 0 0 1h1v1H9a.5.5 0 0 0 0 1h1v1H9a.5.5 0 0 0 0 1h1.22l.61 1H10a.5.5 0 1 0 0 1h1.442l.611 1H11a.5.5 0 1 0 0 1h1.664l.611 1H12a.5.5 0 1 0 0 1h1.886l.758 1.24a.5.5 0 0 1-.427.76H1.783a.5.5 0 0 1-.427-.76l4.57-7.48A.5.5 0 0 0 6 6.5V1h4z"
  }));
});
Flask.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  className: PropTypes.string
};
export default Flask;