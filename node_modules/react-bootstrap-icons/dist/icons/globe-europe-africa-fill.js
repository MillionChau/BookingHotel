var _excluded = ["color", "size", "title", "className"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
var GlobeEuropeAfricaFill = /*#__PURE__*/forwardRef(function (_ref, ref) {
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
    className: ['bi', 'bi-globe-europe-africa-fill', className].filter(Boolean).join(' ')
  }, rest), title ? /*#__PURE__*/React.createElement("title", null, title) : null, /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    d: "M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0m0 1a6.97 6.97 0 0 0-4.335 1.505l-.285.641a.847.847 0 0 0 1.48.816l.244-.368a.81.81 0 0 1 1.035-.275.81.81 0 0 0 .722 0l.262-.13a1 1 0 0 1 .775-.05l.984.34q.118.04.243.054c.784.093.855.377.694.801a.84.84 0 0 1-1.035.487l-.01-.003C8.273 4.663 7.747 4.5 6 4.5 4.8 4.5 3.5 5.62 3.5 7c0 3 1.935 1.89 3 3 1.146 1.194-1 4 2 4 1.75 0 3-3.5 3-4.5 0-.704 1.5-1 1-2.5-.097-.291-.396-.568-.642-.756-.173-.133-.206-.396-.051-.55a.334.334 0 0 1 .42-.043l1.085.724a.276.276 0 0 0 .348-.035c.15-.15.414-.083.488.117.16.428.445 1.046.847 1.354A7 7 0 0 0 8 1"
  }));
});
GlobeEuropeAfricaFill.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  className: PropTypes.string
};
export default GlobeEuropeAfricaFill;