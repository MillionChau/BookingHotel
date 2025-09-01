var _excluded = ["color", "size", "title", "className"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
var Border = /*#__PURE__*/forwardRef(function (_ref, ref) {
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
    className: ['bi', 'bi-border', className].filter(Boolean).join(' ')
  }, rest), title ? /*#__PURE__*/React.createElement("title", null, title) : null, /*#__PURE__*/React.createElement("path", {
    d: "M0 0h.969v.5H1v.469H.969V1H.5V.969H0zm2.844 1h-.938V0h.938zm1.875 0H3.78V0h.938v1zm1.875 0h-.938V0h.938zm.937 0V.969H7.5V.5h.031V0h.938v.5H8.5v.469h-.031V1zm2.813 0h-.938V0h.938zm1.875 0h-.938V0h.938zm1.875 0h-.938V0h.938zM15.5 1h-.469V.969H15V.5h.031V0H16v.969h-.5zM1 1.906v.938H0v-.938zm6.5.938v-.938h1v.938zm7.5 0v-.938h1v.938zM1 3.78v.938H0V3.78zm6.5.938V3.78h1v.938zm7.5 0V3.78h1v.938zM1 5.656v.938H0v-.938zm6.5.938v-.938h1v.938zm7.5 0v-.938h1v.938zM.969 8.5H.5v-.031H0V7.53h.5V7.5h.469v.031H1v.938H.969zm1.875 0h-.938v-1h.938zm1.875 0H3.78v-1h.938v1zm1.875 0h-.938v-1h.938zm1.875-.031V8.5H7.53v-.031H7.5V7.53h.031V7.5h.938v.031H8.5v.938zm1.875.031h-.938v-1h.938zm1.875 0h-.938v-1h.938zm1.875 0h-.938v-1h.938zm1.406 0h-.469v-.031H15V7.53h.031V7.5h.469v.031h.5v.938h-.5zM0 10.344v-.938h1v.938zm7.5 0v-.938h1v.938zm8.5-.938v.938h-1v-.938zM0 12.22v-.938h1v.938zm7.5 0v-.938h1v.938zm8.5-.938v.938h-1v-.938zM0 14.094v-.938h1v.938zm7.5 0v-.938h1v.938zm8.5-.938v.938h-1v-.938zM.969 16H0v-.969h.5V15h.469v.031H1v.469H.969zm1.875 0h-.938v-1h.938zm1.875 0H3.78v-1h.938v1zm1.875 0h-.938v-1h.938zm.937 0v-.5H7.5v-.469h.031V15h.938v.031H8.5v.469h-.031v.5zm2.813 0h-.938v-1h.938zm1.875 0h-.938v-1h.938zm1.875 0h-.938v-1h.938zm.937 0v-.5H15v-.469h.031V15h.469v.031h.5V16z"
  }));
});
Border.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  className: PropTypes.string
};
export default Border;