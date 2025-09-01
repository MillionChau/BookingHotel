var _excluded = ["color", "size", "title", "className"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
var SignDeadEnd = /*#__PURE__*/forwardRef(function (_ref, ref) {
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
    className: ['bi', 'bi-sign-dead-end', className].filter(Boolean).join(' ')
  }, rest), title ? /*#__PURE__*/React.createElement("title", null, title) : null, /*#__PURE__*/React.createElement("path", {
    d: "M4.783 6v2h.69c.593 0 .886-.359.886-1.002S6.07 6 5.473 6zm.333.28h.32c.395 0 .582.24.582.722 0 .48-.186.718-.581.718h-.321zM7.82 7.72h-.918v-.602h.863V6.85h-.863v-.57h.917V6H6.571v2H7.82zm.573-.274L8.216 8h-.34l.688-2h.371l.689 2h-.352l-.177-.554zm.627-.255-.268-.845h-.015l-.27.845zM9.746 6v2h.69c.593 0 .886-.359.886-1.002S11.032 6 10.436 6zm.333.28h.32c.394 0 .582.24.582.722 0 .48-.186.718-.582.718h-.32zm-4.173 4.44h.917V11H5.575V9h1.248v.28h-.917v.57h.863v.268h-.863zm1.489.28V9.56h.013L8.344 11h.292V9h-.32v1.436h-.014L7.369 9h-.293v2zm1.56 0V9h.69c.596 0 .886.355.886.998S10.238 11 9.645 11zm.653-1.72h-.32v1.44h.32c.395 0 .581-.239.581-.718 0-.481-.187-.722-.581-.722"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zm-1.4.7a.495.495 0 0 1 .7 0l6.516 6.515a.495.495 0 0 1 0 .7L8.35 14.866a.495.495 0 0 1-.7 0L1.134 8.35a.495.495 0 0 1 0-.7L7.65 1.134Z"
  }));
});
SignDeadEnd.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  className: PropTypes.string
};
export default SignDeadEnd;