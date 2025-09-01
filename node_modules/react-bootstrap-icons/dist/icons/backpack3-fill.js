var _excluded = ["color", "size", "title", "className"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
var Backpack3Fill = /*#__PURE__*/forwardRef(function (_ref, ref) {
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
    className: ['bi', 'bi-backpack3-fill', className].filter(Boolean).join(' ')
  }, rest), title ? /*#__PURE__*/React.createElement("title", null, title) : null, /*#__PURE__*/React.createElement("path", {
    d: "M5 10v3h6v-3h-1v.5a.5.5 0 0 1-1 0V10z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 2v.341a6 6 0 0 0-1.308.653l-.416-1.247a1 1 0 0 0-1.749-.284l-.77 1.027a1 1 0 0 0-.149.917l.803 2.407A6 6 0 0 0 2 8v5.5A2.5 2.5 0 0 0 4.5 16h7a2.5 2.5 0 0 0 2.5-2.5V8c0-.771-.146-1.509-.41-2.186l.801-2.407a1 1 0 0 0-.148-.917l-.77-1.027a1 1 0 0 0-1.75.284l-.415 1.247A6 6 0 0 0 10 2.34V2a2 2 0 1 0-4 0m1 0a1 1 0 0 1 2 0v.083a6 6 0 0 0-2 0zm5.941 2.595a6 6 0 0 0-.8-.937l.531-1.595.77 1.027zM3.86 3.658a6 6 0 0 0-.8.937L2.557 3.09l.77-1.027zm.18 3.772a4 4 0 0 1 7.92 0 .5.5 0 1 1-.99.142 3 3 0 0 0-5.94 0 .5.5 0 1 1-.99-.142M4 9.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5z"
  }));
});
Backpack3Fill.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  className: PropTypes.string
};
export default Backpack3Fill;