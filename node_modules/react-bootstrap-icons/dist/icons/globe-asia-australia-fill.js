var _excluded = ["color", "size", "title", "className"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
var GlobeAsiaAustraliaFill = /*#__PURE__*/forwardRef(function (_ref, ref) {
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
    className: ['bi', 'bi-globe-asia-australia-fill', className].filter(Boolean).join(' ')
  }, rest), title ? /*#__PURE__*/React.createElement("title", null, title) : null, /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    d: "M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0m3.041 9a1 1 0 0 0-.946.674l-.172.499a1 1 0 0 1-.403.515l-.803.517a1 1 0 0 0-.458.84v.455a1 1 0 0 0 1 1h.257c.192 0 .38.055.542.16l.762.491a1 1 0 0 0 .282.123A7 7 0 0 0 14.82 9.57a1 1 0 0 0-.085-.061l-.315-.204a1 1 0 0 0-.977-.06l-.169.082a1 1 0 0 1-.742.051l-1.02-.33A1 1 0 0 0 11.205 9zm-5.832 2.655a.302.302 0 1 0-.298.52l.762.325.48.232A.386.386 0 1 0 6.321 12h-.417a.7.7 0 0 1-.418-.139zM8 1a7 7 0 0 0-6.387 9.864l.754-1.285a1 1 0 0 1 1.546-.225l1.074 1.005a.986.986 0 0 0 1.36-.011l.038-.037a.88.88 0 0 0 .26-.754c-.075-.549.37-1.035.92-1.1.728-.086 1.587-.324 1.728-.957.086-.386-.115-.83-.361-1.2-.208-.312 0-.8.374-.8.122 0 .24-.055.318-.15l.393-.474c.196-.237.49-.368.797-.403.554-.065 1.407-.277 1.582-.973.185-.731-.986-.944-.998-1.62A7 7 0 0 0 8 1m.524 8.963a.413.413 0 1 0-.783-.183v.028a.46.46 0 0 1-.137.326l-.113.107a.36.36 0 0 0 .5.518l.193-.187a.6.6 0 0 0 .12-.166zm3.374-4.444c-.252-.244-.681-.139-.931.107-.256.251-.578.406-.918.585-.338.177-.264.625.101.735a.48.48 0 0 0 .345-.027l1.278-.617a.484.484 0 0 0 .125-.783"
  }));
});
GlobeAsiaAustraliaFill.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  className: PropTypes.string
};
export default GlobeAsiaAustraliaFill;