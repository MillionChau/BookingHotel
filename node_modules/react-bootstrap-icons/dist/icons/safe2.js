var _excluded = ["color", "size", "title", "className"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
var Safe2 = /*#__PURE__*/forwardRef(function (_ref, ref) {
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
    className: ['bi', 'bi-safe2', className].filter(Boolean).join(' ')
  }, rest), title ? /*#__PURE__*/React.createElement("title", null, title) : null, /*#__PURE__*/React.createElement("path", {
    d: "M1 2.5A1.5 1.5 0 0 1 2.5 1h12A1.5 1.5 0 0 1 16 2.5v12a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 1 14.5V14H.5a.5.5 0 0 1 0-1H1V9H.5a.5.5 0 0 1 0-1H1V4H.5a.5.5 0 0 1 0-1H1zM2.5 2a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5v-12a.5.5 0 0 0-.5-.5z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5.035 8h1.528q.072-.277.214-.516l-1.08-1.08A3.5 3.5 0 0 0 5.035 8m1.369-2.303 1.08 1.08q.24-.142.516-.214V5.035a3.5 3.5 0 0 0-1.596.662M9 5.035v1.528q.277.072.516.214l1.08-1.08A3.5 3.5 0 0 0 9 5.035m2.303 1.369-1.08 1.08q.142.24.214.516h1.528a3.5 3.5 0 0 0-.662-1.596M11.965 9h-1.528q-.072.277-.214.516l1.08 1.08A3.5 3.5 0 0 0 11.965 9m-1.369 2.303-1.08-1.08q-.24.142-.516.214v1.528a3.5 3.5 0 0 0 1.596-.662M8 11.965v-1.528a2 2 0 0 1-.516-.214l-1.08 1.08A3.5 3.5 0 0 0 8 11.965m-2.303-1.369 1.08-1.08A2 2 0 0 1 6.563 9H5.035c.085.593.319 1.138.662 1.596M4 8.5a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0m4.5-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2"
  }));
});
Safe2.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  className: PropTypes.string
};
export default Safe2;