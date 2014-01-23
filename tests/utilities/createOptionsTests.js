define(['underscore', 'chai', 'mocha', 'sinon', 'sinonChai', '../../app/utilities/createOptions', 'sinonSpy'],
    function (_, chai, mocha, sinon, sinonChai, createOptions) {
        'use strict';

        var should = chai.should();

        // Using Sinon-Chai assertions for spies etc. https://github.com/domenic/sinon-chai
        chai.use(sinonChai);
        mocha.setup('bdd');

        describe('createOptions', function() {
            var defaultOptions,
                otherOptions,
                customOptions;

            beforeEach(function () {
                defaultOptions = {
                    defaultKey: 'defaultOptionsValue',
                    sharedKey: 'sharedValueInDefaultOptions'
                };
                otherOptions = {
                    otherKey: 'otherOptionsValue',
                    sharedKey: 'sharedValueInOtherOptions'
                };
                customOptions = {
                    customKey: 'customOptionValue',
                    sharedKey: 'sharedValueInCustomOption'
                };
            });

            it('should use the defaultOptions if view defines one and none is passed in', function() {
                var options = createOptions(undefined, defaultOptions);

                options.should.deep.equal(defaultOptions);
            });
            it('should extend the default options with options that are passed in (if any)', function() {
                var options = createOptions(customOptions, defaultOptions);

                options.should.deep.equal({
                    defaultKey: 'defaultOptionsValue',
                    customKey: 'customOptionValue',
                    sharedKey: 'sharedValueInCustomOption'
                });
            });
            it('keys from the default options can be shadowed by options with keys of value undefined', function() {
                var options;
                otherOptions.defaultKey = undefined;
                options = createOptions(otherOptions, defaultOptions);
                options.should.deep.equal({
                    defaultKey: undefined,
                    otherKey: 'otherOptionsValue',
                    sharedKey: 'sharedValueInOtherOptions'
                });
            });
            it('defaultOptions can be ignored by setting the "useDefaults" to false', function() {
                var options = createOptions(customOptions, defaultOptions, false);

                options.should.deep.equal({
                    customKey: 'customOptionValue',
                    sharedKey: 'sharedValueInCustomOption'
                });
            });
            describe('backwards compatibility with earlier versions requires that', function() {
                it('should have undefined options if no defaultOptions and no options are given', function() {
                    var options = createOptions(undefined, undefined);

                    should.equal(options, undefined);
                });
                it('should use arguments as options if view does not define a defaultOptions', function() {
                    var options = createOptions(otherOptions, undefined);

                    options.should.deep.equal(otherOptions);
                });
            });
        });
    });
