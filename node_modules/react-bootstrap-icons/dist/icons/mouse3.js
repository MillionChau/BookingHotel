var _excluded = ["color", "size", "title", "className"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
var Mouse3 = /*#__PURE__*/forwardRef(function (_ref, ref) {
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
    className: ['bi', 'bi-mouse3', className].filter(Boolean).join(' ')
  }, rest), title ? /*#__PURE__*/React.createElement("title", null, title) : null, /*#__PURE__*/React.createElement("path", {
    d: "M7 0q-.891.002-1.527.463c-.418.302-.717.726-.93 1.208C4.123 2.619 4 3.879 4 5.187v.504L3.382 6A2.5 2.5 0 0 0 2 8.236v2.576C2 13.659 4.22 16 7 16h2c2.78 0 5-2.342 5-5.188V5.186c0-1.13-.272-2.044-.748-2.772-.474-.726-1.13-1.235-1.849-1.59C9.981.123 8.26 0 7 0m2.5 6.099V1.232c.51.11 1.008.267 1.46.49.596.293 1.099.694 1.455 1.24.355.543.585 1.262.585 2.225v1.69zm-1-5.025v4.803L5 5.099c.006-1.242.134-2.293.457-3.024.162-.366.363-.63.602-.801C6.292 1.105 6.593 1 7 1c.468 0 .98.018 1.5.074M5 6.124 13 7.9v2.912C13 13.145 11.19 15 9 15H7c-2.19 0-4-1.855-4-4.188V8.236a1.5 1.5 0 0 1 .83-1.342l.187-.093c.01.265.024.58.047.92.062.938.19 2.12.462 2.937a.5.5 0 1 0 .948-.316c-.227-.683-.35-1.75-.413-2.688a29 29 0 0 1-.06-1.528v-.002z"
  }));
});
Mouse3.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  className: PropTypes.string
};
export default Mouse3;