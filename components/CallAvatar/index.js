'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _styles = require('./styles.scss');

var _styles2 = _interopRequireDefault(_styles);

var _Spinner = require('../../assets/images/Spinner.svg');

var _Spinner2 = _interopRequireDefault(_Spinner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CallAvatar = function (_Component) {
  (0, _inherits3.default)(CallAvatar, _Component);

  function CallAvatar(props) {
    (0, _classCallCheck3.default)(this, CallAvatar);

    var _this = (0, _possibleConstructorReturn3.default)(this, (CallAvatar.__proto__ || (0, _getPrototypeOf2.default)(CallAvatar)).call(this, props));

    _this.state = {
      avatarUrl: null,
      avatarUrlLoadFailed: false
    };
    _this._mounted = false;
    return _this;
  }

  (0, _createClass3.default)(CallAvatar, [{
    key: 'loadImg',
    value: function loadImg() {
      var _this2 = this;

      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

      if (!this._mounted) {
        return;
      }
      if (props.avatarUrl) {
        var $img = document.createElement('img');
        $img.src = props.avatarUrl;
        $img.onload = function () {
          if (!_this2._mounted) {
            return;
          }
          _this2.setState({
            avatarUrl: props.avatarUrl
          });
        };
        $img.onerror = function () {
          if (!_this2._mounted) {
            return;
          }
          _this2.setState({
            avatarUrl: null,
            avatarUrlLoadFailed: true
          });
        };
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._mounted = true;
      this.loadImg();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProp) {
      if (nextProp.avatarUrl !== this.props.avatarUrl) {
        this.loadImg(nextProp);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._mounted = false;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          extraNum = _props.extraNum,
          isOnConferenceCall = _props.isOnConferenceCall,
          spinnerMode = _props.spinnerMode;

      var avatarUrlSource = this.props.avatarUrl;
      var avatarUrl = this.state.avatarUrl;

      var initialSize = 38;
      var margin = 4;
      var avatarCircleRadius = 15;
      var extraNumCircleRadius = 8.5;
      var extraNumCircleBorder = 1;
      var $snow = '#fff';
      var $blueLight = '#cee7f2';
      var $blue = '#0684bd';
      var $dark = '#e2e2e2';
      var $transparency = '0.8';
      var res = void 0;
      var hash = _uuid2.default.v4();
      var textId = 'text-' + hash;
      var clipId = 'circleClip-' + hash;
      var avatarStyle = { stroke: $dark, strokeWidth: '1px' };
      var avatarUrlLoadFailed = this.state.avatarUrlLoadFailed;
      var showSpinner = spinnerMode;

      // spinner sizing
      var spinnerId = 'spinner-' + hash;
      var spinnerScaleSize = 1.5;
      var spinnerSize = 12;
      var spinnerTranslateTo = (initialSize - spinnerSize * spinnerScaleSize) / 2;
      var isOnConferenceCallWithExtraNum = isOnConferenceCall && extraNum > 0;
      var spinnerTransform = 'translate(' + (spinnerTranslateTo - (isOnConferenceCallWithExtraNum ? margin : 0)) + ',' + spinnerTranslateTo + ') scale(' + spinnerScaleSize + ', ' + spinnerScaleSize + ')';
      if (isOnConferenceCallWithExtraNum) {
        res = _react2.default.createElement(
          'svg',
          {
            className: _styles2.default.callAvatar,
            style: avatarUrl ? avatarStyle : null,
            viewBox: '0 0 ' + initialSize + ' ' + initialSize,
            preserveAspectRatio: 'xMidYMid meet',
            xmlns: 'http://www.w3.org/2000/svg'
          },
          _react2.default.createElement(
            'defs',
            null,
            _react2.default.createElement(
              'g',
              { id: textId },
              _react2.default.createElement(
                'text',
                {
                  x: '0',
                  y: '0',
                  dy: '29px',
                  style: {
                    fontSize: avatarCircleRadius * 2 + 'px',
                    fill: $blue,
                    opacity: '.5'
                  },
                  className: _styles2.default.portrait
                  // HACK: &#xe904; is the font code for the portrait icon
                },
                '\uE904'
              )
            ),
            _react2.default.createElement(_Spinner2.default, { id: spinnerId })
          ),
          _react2.default.createElement('circle', {
            cx: avatarCircleRadius,
            cy: margin + avatarCircleRadius,
            r: avatarCircleRadius,
            fill: $snow,
            stroke: showSpinner ? $dark : 'inherit',
            strokeOpacity: showSpinner ? $transparency : '1'
          }),
          _react2.default.createElement(
            'g',
            null,
            _react2.default.createElement(
              'clipPath',
              { id: clipId },
              _react2.default.createElement('circle', {
                cx: avatarCircleRadius,
                cy: margin + avatarCircleRadius,
                r: avatarCircleRadius,
                fill: $snow })
            )
          ),
          showSpinner && _react2.default.createElement(
            'g',
            { transform: spinnerTransform },
            _react2.default.createElement('use', { xlinkHref: '#' + spinnerId })
          ),
          avatarUrl && _react2.default.createElement('image', { clipPath: 'url(#' + clipId + ')', height: '100%', width: '100%', xlinkHref: avatarUrl }),
          !showSpinner && (!avatarUrlSource || !avatarUrl || avatarUrlLoadFailed) && _react2.default.createElement('use', { xlinkHref: '#' + textId, clipPath: 'url(#' + clipId + ')' }),
          _react2.default.createElement('circle', {
            cx: initialSize - extraNumCircleRadius,
            cy: extraNumCircleRadius,
            r: extraNumCircleRadius,
            fill: $snow }),
          _react2.default.createElement('circle', {
            cx: initialSize - extraNumCircleRadius,
            cy: extraNumCircleRadius,
            r: extraNumCircleRadius - extraNumCircleBorder,
            fill: $blueLight }),
          _react2.default.createElement(
            'text',
            {
              x: initialSize - extraNumCircleRadius,
              y: extraNumCircleRadius,
              dy: '3px',
              textAnchor: 'middle',
              style: {
                fontSize: '9px',
                stroke: 'none',
                fill: $blue,
                fontWeight: 'bolder',
                opacity: '.5'
              } },
            '+' + extraNum
          )
        );
      } else {
        res = _react2.default.createElement(
          'svg',
          {
            className: _styles2.default.callAvatar,
            style: avatarUrl ? avatarStyle : null,
            viewBox: '0 0 ' + initialSize + ' ' + initialSize,
            xmlns: 'http://www.w3.org/2000/svg' },
          _react2.default.createElement(
            'defs',
            null,
            _react2.default.createElement(
              'g',
              { id: textId },
              _react2.default.createElement(
                'text',
                {
                  x: '0',
                  y: '0',
                  dy: '29px',
                  dx: '2',
                  style: {
                    fontSize: (initialSize / 2 - 2) * 2 + 'px',
                    fill: $blue,
                    opacity: '.5'
                  },
                  className: _styles2.default.portrait },
                '\uE904'
              )
            ),
            _react2.default.createElement(_Spinner2.default, { id: spinnerId })
          ),
          _react2.default.createElement('circle', {
            cx: initialSize / 2,
            cy: initialSize / 2,
            r: initialSize / 2,
            fill: $snow,
            stroke: showSpinner ? $dark : 'inherit',
            strokeOpacity: showSpinner ? $transparency : '1'
          }),
          _react2.default.createElement(
            'g',
            null,
            _react2.default.createElement(
              'clipPath',
              { id: clipId },
              _react2.default.createElement('circle', {
                cx: initialSize / 2,
                cy: initialSize / 2,
                r: initialSize / 2 - 1
              })
            )
          ),
          showSpinner && _react2.default.createElement(
            'g',
            { transform: spinnerTransform },
            _react2.default.createElement('use', { xlinkHref: '#' + spinnerId })
          ),
          showSpinner && _react2.default.createElement(
            'g',
            { transform: spinnerTransform },
            _react2.default.createElement('use', { xlinkHref: '#' + spinnerId })
          ),
          avatarUrl && _react2.default.createElement('image', {
            clipPath: 'url(#' + clipId + ')',
            height: '100%',
            width: '100%',
            xlinkHref: avatarUrl,
            preserveAspectRatio: 'xMinYMin slice' }),
          !showSpinner && (!avatarUrlSource || !avatarUrl || avatarUrlLoadFailed) && _react2.default.createElement('use', { xlinkHref: '#' + textId, clipPath: 'url(#' + clipId + ')' })
        );
      }
      return res;
    }
  }]);
  return CallAvatar;
}(_react.Component);

CallAvatar.propTypes = {
  isOnConferenceCall: _propTypes2.default.bool,
  avatarUrl: _propTypes2.default.string,
  extraNum: _propTypes2.default.number,
  /**
   * Set to true to make it always show the loading spinner.
   */
  spinnerMode: _propTypes2.default.bool
};

CallAvatar.defaultProps = {
  isOnConferenceCall: false,
  avatarUrl: null,
  extraNum: 0,
  spinnerMode: false
};

exports.default = CallAvatar;
//# sourceMappingURL=index.js.map
