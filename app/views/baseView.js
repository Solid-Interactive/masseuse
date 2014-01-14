/*global define:false*/
define([
    'jquery', 'backbone', 'underscore', '../utilities/channels', './viewContext', './lifeCycle',
    '../utilities/accessors'
], function ($, Backbone, _, Channels, ViewContext, lifeCycle, accessors) {
    'use strict';

    var viewOptions = ['name', 'appendView'],
        BEFORE_RENDER_DONE = 'beforeRenderDone',
        RENDER_DONE = 'renderDone',
        AFTER_RENDER_DONE = 'afterRenderDone',
        MODEL_DATA = 'modelData',
        /**
         * @class A View that adds lifecycle methods to Views that are optionally async using jQuery promises.
         * Adds support for adding child Views
         * @module views/BaseView
         * @type {*|extend|extend|extend|void|Object}
         */
        BaseView = Backbone.View.extend({
            defaultBindings : [],
            initialize : initialize,
            start : start,
            render : render,
            dataToJSON : dataToJSON,
            bindEventListeners : bindEventListeners,
            remove : remove,
            children : null,
            addChild : addChild,
            removeChild : removeChild,
            refreshChildren : refreshChildren,
            removeAllChildren : removeAllChildren,
            appendOrInsertView : appendOrInsertView,
            setEl : setEl

            // Dynamically created, so the cache is not shared on the prototype:
            // elementCache: elementCache
        });

    BaseView.beforeRenderDone = BEFORE_RENDER_DONE;
    BaseView.renderDone = RENDER_DONE;
    BaseView.afterRenderDone = AFTER_RENDER_DONE;

    // Share channels among all Views
    BaseView.prototype.channels = BaseView.prototype.channels ||  new Channels();

    return BaseView;

    function initialize (options) {
        var self = this;

        this.elementCache = _.memoize(elementCache);

        if(options) {
            options = _.clone(options, true);
            this.initialEl = options.el;
            if (options.viewOptions) {
                viewOptions = viewOptions.concat(options.viewOptions);
            }
            _.extend(this, _.pick(options, viewOptions));
        }


        _setTemplate.call(this, options);
        _setModel.call(this, options);
        _setBoundEventListeners.call(this, options);
        if (options && options.plugins && options.plugins.length) {
            _.each(options.plugins, function (plugin) {
                plugin.call(self);
            });

        }

        this.children = [];
    }

    /**
     * Wrapper method for lifecycle methods.
     *
     * In order, this method:
     * - Calls this.beforeRender()
     * - Starts any child views
     * - Notifies that beforeRender is done
     * - If the view has a parent, waits for its parent to render
     * - Calls this.render()
     * - Notifies that render is done
     * - Calls this.afterRender()
     * - Notifies that afterRender is done
     * - Resolves the returned promise
     *
     * @param {jQuery.promise} $parentRenderPromise - If passed in, the start method was called from a parent view
     * start() method.
     * @returns {jQuery.promise} A promise that is resolved when when the start method has completed
     */
    function start ($parentRenderPromise) {
        var $deferred = new $.Deferred();

        // ParentView calls .start() on all children
        // ParentView doesn't render until all children have notified that they are done
        // After rendering, the ParentView notifies all children and they continue their lifecycle
        _.defer(lifeCycle.runAllMethods.bind(this, $deferred, $parentRenderPromise));

        return $deferred.promise();
    }

    function render () {
        this.setEl();
        this.appendOrInsertView();
    }

    function setEl () {
        if (undefined === this.el && undefined !== this.initialEl || this.parent && undefined !== this.initialEl) {
            this.setElement($(this.initialEl));
        }
    }

    function appendOrInsertView () {
        if (this.$el && this.template) {
            if (this.appendView) {
                _appendView.call(this);
            } else {
                _insertView.call(this);
            }
        }
    }

    function _appendView () {
        this.$el.append(this.template(this.dataToJSON()));
        this.setElement(this.$el.children().last());
    }

    function _insertView () {
        this.$el.html(this.template(this.dataToJSON()));
    }

    // This function is memoized in initialize
    function elementCache (selector) {
        return this.$el.find(selector);
    }

    function dataToJSON () {
        return this.model ? this.model.toJSON() : {};
    }

    /**
     * bindEventListeners
     * Bind all event listeners specified in 'defaultListeners' and 'options.listeners' using 'listenTo'
     *
     * @param listenerArray (Array[Array])  - A collection of arrays of arguments that will be used with
     * 'Backbone.Events.listenTo'
     *
     * @example:
     *      bindEventListeners([['myModel', 'change:something', 'myCallbackFunction']]);
     *
     * @remarks
     * Passing in an array with a string as the first parameter will attempt to bind to this[firstArgument] so that
     * it is possible to listen to view properties that have not yet been instantiated (i.e. viewModels)
     */
    function bindEventListeners (listenerArray) {
        var self = this,
            listenerArgs;

        this.stopListening();

        listenerArgs = _.map(listenerArray.concat(this.defaultBindings), function (argsArray) {

            // Since the view config object doesn't have access to the view's context, we must provide it
            _.each([argsArray[0], argsArray[1] , argsArray[2]], function (arg, index) {
                if (_.isString(arg) && index != 1) {
                    argsArray[index] = accessors.getProperty(self, arg);
                } else if (index == 1) {
                    argsArray[index] = arg;
                }
            });

            return argsArray;
        });

        // TODO: test that duplicate items will pick the bindings from options, throwing out defaults
        listenerArray = _.uniq(listenerArgs, function (a) {
            return _.identity(a);
        });

        _.each(listenerArray, function (listenerArgs) {
            self.listenTo.apply(self, listenerArgs);
        });
    }

    function remove () {
        this.removeAllChildren();

        if (this.parent) {
            this.parent.removeChild(this);
        }

        Backbone.View.prototype.remove.apply(this, arguments);
    }

    function addChild (childView) {
        if (!_(this.children).contains(childView)) {
            this.children.push(childView);
            childView.parent = this;
        }
    }

    function removeChild (childView) {
        this.children = _(this.children).without(childView);
    }

    function removeAllChildren () {
        var self = this;
        _(this.children).each(function (child) {
            child.remove();
            self.removeChild(child);
        });
    }

    function refreshChildren () {
        var $deferred = new $.Deferred(),
            childPromiseArray = [];

        _(this.children).each(function (child) {
            if (child.hasStarted) {
                Backbone.View.prototype.remove.apply(child);
            }
            childPromiseArray.push(child.start());
        });

        $.when.apply($, childPromiseArray).then($deferred.resolve);

        return $deferred.promise();
    }

    /**
     * Private Methods - must be supplied with context
     * @private
     */

    function _setTemplate (options) {
        if (options && options.templateHtml) {
            this.template = _.template(options.templateHtml);
        }
    }

    function _setModel (options) {
        var self = this,
            ModelType = Backbone.Model,
            modelData;

        if (options && options.ModelType) {
            ModelType = options.ModelType;
        }
        if (!this.model) {
            modelData = _.result(options, MODEL_DATA);
            _.each(modelData, function (datum, key) {
                if (datum instanceof ViewContext) {
                    modelData[key] = datum.getBoundFunction(self);
                }
            });
            this.model = new ModelType(modelData);
        } else {
            this.model = options.model;
        }
    }

    function _setBoundEventListeners (options) {
        if (options && options.bindings) {
            this.bindEventListeners(options.bindings);
        }
    }
});
