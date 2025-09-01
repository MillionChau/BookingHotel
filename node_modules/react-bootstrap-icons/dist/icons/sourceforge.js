var _excluded = ["color", "size", "title", "className"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
var Sourceforge = /*#__PURE__*/forwardRef(function (_ref, ref) {
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
    className: ['bi', 'bi-sourceforge', className].filter(Boolean).join(' ')
  }, rest), title ? /*#__PURE__*/React.createElement("title", null, title) : null, /*#__PURE__*/React.createElement("path", {
    d: "M9.13 8.43c0-2.604-.929-3.79-1.42-4.24a.14.14 0 0 0-.232.123c.095 1.472-1.762 1.84-1.762 4.144v.013c0 1.404 1.065 2.55 2.376 2.55s2.377-1.146 2.377-2.55v-.013c0-.655-.246-1.282-.492-1.745-.055-.096-.191-.055-.178.027.451 1.99-.669 3.217-.669 1.69Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6.303 13.923a.25.25 0 0 1-.164-.068L.061 7.789c-.081-.082-.081-.232 0-.327l6.42-6.407A.3.3 0 0 1 6.63 1h1.844c.109 0 .177.068.204.136a.22.22 0 0 1-.054.246L2.602 7.407a.304.304 0 0 0 0 .436l4.766 4.771c.082.082.082.232 0 .328l-.915.927a.3.3 0 0 1-.15.054m1.216 1.063a.22.22 0 0 1-.15-.382l6.036-6.025a.32.32 0 0 0 .096-.218.27.27 0 0 0-.096-.218l-4.78-4.771c-.082-.082-.082-.232 0-.327l.929-.927a.23.23 0 0 1 .163-.068c.069 0 .11.04.15.081l6.065 6.067c.04.04.068.095.068.163a.23.23 0 0 1-.068.164l-6.42 6.407A.23.23 0 0 1 9.35 15H7.52z"
  }));
});
Sourceforge.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  className: PropTypes.string
};
export default Sourceforge;