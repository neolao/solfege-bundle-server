"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var MiddlewareCompilerPass = class MiddlewareCompilerPass {
    *process(container) {
        var factoryDefinition = container.getDefinition("http_server_factory");

        var serviceIds = container.findTaggedServiceIds("http_server_middleware");
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = serviceIds[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var serviceId = _step.value;

                var middlewareReference = container.getReference(serviceId);
                var middlewareDefinition = container.getDefinition(serviceId);
                var middlewareTags = middlewareDefinition.getTags();

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
};
exports.default = MiddlewareCompilerPass;
module.exports = exports["default"];