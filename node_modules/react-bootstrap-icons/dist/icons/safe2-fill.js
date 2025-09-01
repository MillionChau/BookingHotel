var _excluded = ["color", "size", "title", "className"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
var Safe2Fill = /*#__PURE__*/forwardRef(function (_ref, ref) {
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
    className: ['bi', 'bi-safe2-fill', className].filter(Boolean).join(' ')
  }, rest), title ? /*#__PURE__*/React.createElement("title", null, title) : null, /*#__PURE__*/React.createElement("path", {
    d: "M6.563 8H5.035a3.5 3.5 0 0 1 .662-1.596l1.08 1.08q-.142.24-.214.516m.921-1.223-1.08-1.08A3.5 3.5 0 0 1 8 5.035v1.528q-.277.072-.516.214M9 6.563V5.035a3.5 3.5 0 0 1 1.596.662l-1.08 1.08A2 2 0 0 0 9 6.563m1.223.921 1.08-1.08c.343.458.577 1.003.662 1.596h-1.528a2 2 0 0 0-.214-.516M10.437 9h1.528a3.5 3.5 0 0 1-.662 1.596l-1.08-1.08q.142-.24.214-.516m-.921 1.223 1.08 1.08A3.5 3.5 0 0 1 9 11.965v-1.528q.277-.072.516-.214M8 10.437v1.528a3.5 3.5 0 0 1-1.596-.662l1.08-1.08q.24.142.516.214m-1.223-.921-1.08 1.08A3.5 3.5 0 0 1 5.035 9h1.528q.072.277.214.516M7.5 8.5a1 1 0 1 1 2 0 1 1 0 0 1-2 0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M2.5 1A1.5 1.5 0 0 0 1 2.5V3H.5a.5.5 0 0 0 0 1H1v4H.5a.5.5 0 0 0 0 1H1v4H.5a.5.5 0 0 0 0 1H1v.5A1.5 1.5 0 0 0 2.5 16h12a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 14.5 1zm6 3a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9"
  }));
});
Safe2Fill.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  className: PropTypes.string
};
export default Safe2Fill;