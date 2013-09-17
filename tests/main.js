/*global require*/
'use strict';

// Require.js allows us to configure shortcut alias
require.config({
    shim : {
        underscore : {
            exports : '_'
        },
        mocha : {
            exports : 'mocha'
        },
        sinon : {
            exports : 'sinon'
        }
    },
    paths : {
        underscore : '../app/vendor/lodash/dist/lodash.underscore',
        jquery : '../app/vendor/jquery/jquery',
        backbone : '../app/vendor/backbone-amd/backbone',
        text : '../app/vendor/requirejs-text/text',
        mocha : '../app/vendor/mocha/mocha',
        chai : '../app/vendor/chai/chai',
        squire : '../app/vendor/squire/src/Squire',
        sinon : '../app/vendor/sinon/lib/sinon',
        sinonSpy : '../app/vendor/sinon/lib/sinon/spy',
        sinonChai  : '../app/vendor/sinon-chai/lib/sinon-chai',
        sinonCall : '../app/vendor/sinon/lib/sinon/call',

        baseView : '../app/views/base/baseView',

        channels : '../app/channels',

        mixin : '../app/mixins/mixin'
    }
});

require([
    'mocha',
    '././baseView'
], function (mocha) {
    mocha.run();
});
