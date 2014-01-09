define(['backbone', './computedProperty', './proxyProperty', 'underscore'],
    function (Backbone, ComputedProperty, ProxyProperty, _) {
        'use strict';

        /**
         * A Backbone Model with Proxy and Computed Properties.
         * Proxy and Computed properties are tirggered directly and not via events for performance reasons.
         * @constructor
         * @alias module:MasseuseModel
         * @extends Backbone.Model
         */
        return Backbone.Model.extend({
            toggleAttribute : function (attribute) {
                this.set(attribute, !this.get(attribute));
            },
            set : function (key, val, options) {
                var self = this,
                    attrs = {},
                    stack = [],
                    delayInitial = [],
                    callSelf = false;

                this.computedCallbacks = this.computedCallbacks || {};
                if (key === null) {
                    return this;
                } else if (typeof key == 'object') {
                    attrs = key;
                    options = val;

                    _.each(key, function (attrValue, attrKey) {
                        if (attrValue instanceof ComputedProperty) {
                            if (!attrValue.skipInitialComputation) {
                                self.bindComputed(attrKey, attrValue);
                                callSelf = true;
                            } else {
                                delayInitial.push(function () {
                                    self.bindComputed(attrKey, attrValue);
                                });
                            }
                            delete attrs[attrKey];
                        } else if (attrValue instanceof ProxyProperty) {
                            self.bindProxy(attrKey, attrValue);
                            delete attrs[attrKey];
                        } else {
                            if (self.computedCallbacks[attrKey]) {
                                stack.push(self.computedCallbacks[attrKey]);
                            }
                        }
                    });
                } else {
                    attrs[key] = val;
                    if (val instanceof ComputedProperty) {
                        this.bindComputed(key, val);
                        return;
                    } else if (val instanceof ProxyProperty) {
                        this.bindProxy(key, val);
                        return;
                    } else {
                        _pushToComputedCallbacks.call(this, key, stack);
                    }
                }

                if (callSelf) {
                    this.set.apply(this, [attrs, options]);
                } else {
                    Backbone.Model.prototype.set.apply(this, [attrs, options]);
                    _.forEach(stack, function (callbackArray) {
                        _.forEach(callbackArray, function (callback) {
                            callback.call(self);
                        });
                    });
                }
                if (delayInitial) {
                    _.forEach(delayInitial, function (cb) {
                        cb();
                    });
                }
            },
            bindComputed : function (key, computed) {
                var self = this,
                    callback;

                callback = function () {
                    this.set(key, computed.callback.apply(this, this.getListenableValues(computed.listenables)));
                };

                _.forEach(computed.listenables, function (listenTo) {
                    self.computedCallbacks[listenTo] = self.computedCallbacks[listenTo] || [];
                    self.computedCallbacks[listenTo].push(callback);
                    if (!computed.skipInitialComputation) {
                        callback.call(self);
                    }
                });
            },
            bindProxy : function (key, proxy) {
                var self = this,
                    model = proxy.model,
                    modelAttribute = proxy.propertyNameOnModel;

                this.set(key, model.get(modelAttribute));

                model.on('change:' + modelAttribute, function () {
                    self.set(key, model.get(modelAttribute));
                });

                this.on('change:' + key, function () {
                    model.set(modelAttribute, self.get(key));
                });

            },
            getListenableValues : function (listenables) {
                var args = [],
                    self = this;

                _.each(listenables, function (listenablePropertyKey) {
                    args.push(self.get(listenablePropertyKey));
                });

                return args;
            }
        });

        function _pushToComputedCallbacks (key, stack) {
            if (this.computedCallbacks[key]) {
                stack.push(this.computedCallbacks[key]);
            }
        }
    });

