/* jshint loopfunc:true, maxdepth:3 */
define(['jquery', 'rivets', './configureMethod', 'backbone', 'underscore'],
    function ($, Rivets, configureMethod, Backbone, _) {
        'use strict';

        var keySeparator = /->/g;

        /**
         * Adapter originally from https://gist.github.com/mogadanez/5728747
         */

        // TODO: remove configureMethod, it is not really being used here

        /**
         * @namespace adapter
         */
        return configureMethod({
            rivetScope : undefined,
            rivetPrefix : undefined,
            instaUpdateRivets : false
        }, function (config) {
            Rivets.adapters[':'] =  {
                /**
                 * @memberof adapter
                 * @instance
                 * @param model
                 * @param keypath
                 * @param callback
                 */
                subscribe : function (model, keypath, callback) {
                    keypath = keypath.replace(keySeparator,'.');
                    if (model instanceof Backbone.Collection) {
                        model.on('add remove reset change', function (obj, keypath) {
                            callback(obj.get(keypath));
                        });
                    } else if (model instanceof Backbone.Model) {
                        model.on('change', function () {
                            // TODO: make this more efficient / specific
                            callback(model.get(keypath));
                        });
                    }
                },

                /**
                 * @memberof adapter
                 * @instance
                 * @param model
                 * @param keypath
                 */
                unsubscribe : function (model, keypath) {
                    if (typeof (model) == 'undefined') {
                        return;
                    }
                    if (model instanceof Backbone.Collection) {
                        model.off('add remove reset change');
                    } else if (model.off) {
                        model.off('change:' + keypath.replace(keySeparator,'.'));
                    }
                },

                /**
                 * @memberof adapter
                 * @instance
                 * @param model
                 * @param keypath
                 * @returns {*}
                 */
                read : function (model, keypath) {
                    if(model instanceof Backbone.Collection) {
                        return model.models;
                    }
                    return model.get(keypath.replace(keySeparator,'.'));
                },
                /**
                 * @memberof adapter
                 * @instance
                 * @param model
                 * @param keypath
                 * @param value
                 */
                publish : function (model, keypath, value) {
                    var existingModel;
                    if (model instanceof Backbone.Collection) {
                        existingModel = model.get(value.cid);
                        if (!existingModel) {
                            existingModel.set(value.attributes);
                        } else {
                            model.add(value);
                        }
                    } else if (model instanceof Backbone.Model) {
                        model.set(keypath.replace(keySeparator,'.'), value);
                    }
                }
            };
            Rivets.configure({
                preloadData : true,
                prefix : config.rivetPrefix,
                // preloadData: false

                // This fires when you use data-rv-on-click.
                handler : function(context, ev, binding) {
                    this.call(binding.model, ev, binding.view.models);
                }
            });
            // Rivets works off of listening to the change event, which doesn't happen on inputs until loss of focus
            // Work around that if desired
            if (config.instaUpdateRivets) {
                this.elementCache(config.rivetScope + ' input').on('keypress paste textInput input', function () {
                    $(this).trigger('change');
                });
            }

            Rivets.config.templateDelimiters = ['{{', '}}'];

            _.extend(Rivets.formatters, config.rivetFormatters);
            _.extend(Rivets.binders, config.rivetBinders);

            // bind data to rivets values.
            return Rivets.bind(this.$el, {
                model : this.model,
                view : this,
                collection: this.collection
            });

        }).methodWithDefaultOptions;
    });
