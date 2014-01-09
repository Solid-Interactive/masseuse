define(['underscore', 'jquery'], function (_, $) {

    'use strict';

    /**
     * configureMethod allows the reuse of a function
     *
     * a configureMethod is curried twice. in other words, first configureMethod is called with the configureItFunction
     * and the default options.
     * this creates a "general" configureMethod function. this general function can then be called with the actual,
     * specific
     * options for the situation. this will return the final function that can be attached to your object.
     *
     * in addition to the availability of options, configureIts provide two other pieces of functionality that can be
     * deployed
     * through options.
     *
     * 1) configureIts can implement $.Deferred. to do this set options.async to true. if async is true, then the first
     * argument
     * passed to the configureItFunction will be a deferred instance. this instance can be resolved or rejected as seen
     * fit. its
     * promise will be returned by the final function attached to the object.
     *
     * @param defaultOptions
     * @param configureItFunction
     * @returns {Function}
     */
    return function configureMethod (defaultOptions, methodToConfigure) {

        // Return a once curried function that can be customized for a particular use
        return {
            methodWithDefaultOptions : function (options) {
                var config = {};

                // Create the final config object from the default options and actual options
                _.extend(config, defaultOptions, options);

                // Return the final function that can be attached to the object
                return {
                    methodWithActualOptions : function () {
                        // Arguments is not an array, so we create an array out of it
                        var args = Array.prototype.slice.call(arguments),
                            $deferred,
                            returned;

                        args.unshift(config);

                        if (config.async) {
                            $deferred = new $.Deferred();
                            args.unshift($deferred);
                        }

                        returned = methodToConfigure.apply(this, args);

                        return config.async ? $deferred.promise() : returned;
                    }
                };
            }
        };
    };
});
