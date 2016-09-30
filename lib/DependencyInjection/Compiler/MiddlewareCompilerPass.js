"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

class MiddlewareCompilerPass {
    *process(container) {
        var factoryDefinition = container.getDefinition("http_server_factory");

        var serviceIds = container.findTaggedServiceIds("http_server_middleware");

        if (!(serviceIds && (typeof serviceIds[Symbol.iterator] === 'function' || Array.isArray(serviceIds)))) {
            throw new TypeError("Expected serviceIds to be iterable, got " + _inspect(serviceIds));
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = serviceIds[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var serviceId = _step.value;

                var middlewareReference = container.getReference(serviceId);
                var middlewareDefinition = container.getDefinition(serviceId);
                var middlewareTags = middlewareDefinition.getTags();

                if (!(middlewareTags && (typeof middlewareTags[Symbol.iterator] === 'function' || Array.isArray(middlewareTags)))) {
                    throw new TypeError("Expected middlewareTags to be iterable, got " + _inspect(middlewareTags));
                }

                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = middlewareTags[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var middlewareTag = _step2.value;

                        if (middlewareTag.name !== "http_server_middleware") {
                            continue;
                        }

                        var serverName = "default";
                        var priority = 0;
                        if (middlewareTag.server_name) {
                            serverName = middlewareTag.server_name;
                        }
                        if (middlewareTag.priority) {
                            priority = middlewareTag.priority;
                        }
                        factoryDefinition.addMethodCall("addMiddleware", [serverName, middlewareReference, priority]);
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
}
exports.default = MiddlewareCompilerPass;

function _inspect(input) {
    function _ref2(key) {
        return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key]) + ';';
    }

    function _ref(item) {
        return _inspect(item) === first;
    }

    if (input === null) {
        return 'null';
    } else if (input === undefined) {
        return 'void';
    } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
        return typeof input === "undefined" ? "undefined" : _typeof(input);
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            var first = _inspect(input[0]);

            if (input.every(_ref)) {
                return first.trim() + '[]';
            } else {
                return '[' + input.map(_inspect).join(', ') + ']';
            }
        } else {
            return 'Array';
        }
    } else {
        var keys = Object.keys(input);

        if (!keys.length) {
            if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
                return input.constructor.name;
            } else {
                return 'Object';
            }
        }

        var entries = keys.map(_ref2).join('\n  ');

        if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
            return input.constructor.name + ' {\n  ' + entries + '\n}';
        } else {
            return '{ ' + entries + '\n}';
        }
    }
}

module.exports = exports['default'];