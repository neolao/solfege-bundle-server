"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _solfegejs = require("solfegejs");

var _solfegejs2 = _interopRequireDefault(_solfegejs);

var Application = _solfegejs2["default"].kernel.Application;

var MyBundle = (function () {
    function MyBundle() {
        _classCallCheck(this, MyBundle);
    }

    _createClass(MyBundle, [{
        key: "setApplication",
        value: function* setApplication(application) {
            var bindGenerator = _solfegejs2["default"].util.Function.bindGenerator;
            this.application = application;
            this.application.on(_solfegejs2["default"].kernel.Application.EVENT_START, bindGenerator(this, this.onApplicationStart));
        }
    }, {
        key: "onApplicationStart",
        value: function* onApplicationStart() {
            var server = this.application.getBundle("http");
            yield server.start();
        }
    }]);

    return MyBundle;
})();

exports["default"] = MyBundle;
module.exports = exports["default"];