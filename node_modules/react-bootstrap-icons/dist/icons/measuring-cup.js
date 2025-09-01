var _excluded = ["color", "size", "title", "className"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
var MeasuringCup = /*#__PURE__*/forwardRef(function (_ref, ref) {
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
    className: ['bi', 'bi-measuring-cup', className].filter(Boolean).join(' ')
  }, rest), title ? /*#__PURE__*/React.createElement("title", null, title) : null, /*#__PURE__*/React.createElement("path", {
    d: "M.038.309A.5.5 0 0 1 .5 0H14a2 2 0 0 1 2 2v5.959a1.041 1.041 0 0 1-2.069.17l-.849-5.094A.041.041 0 0 0 13 3.04V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3.743a2.5 2.5 0 0 0-.732-1.768L.146.854A.5.5 0 0 1 .038.309M1.708 1l.267.268A3.5 3.5 0 0 1 3 3.743V14a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V3.041a1.041 1.041 0 0 1 2.069-.17l.849 5.094A.041.041 0 0 0 15 7.96V2a1 1 0 0 0-1-1zM4 3h3.5a.5.5 0 1 1 0 1H4zm0 2h1.5a.5.5 0 1 1 0 1H4zm0 2h3.5a.5.5 0 1 1 0 1H4zm0 2h1.5a.5.5 0 1 1 0 1H4zm0 2h3.5a.5.5 0 0 1 0 1H4zm0 2h1.5a.5.5 0 0 1 0 1H4z"
  }));
});
MeasuringCup.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  className: PropTypes.string
};
export default MeasuringCup;