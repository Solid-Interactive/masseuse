define([
    './views/baseView', './utilities/utilities', './views/viewContext', './routers/masseuseRouter',
    './models/masseuseModel', './models/computedProperty', './models/proxyProperty', './models/observerProperty',
    './plugins/rivets/view'
], function (BaseView, utilities, ViewContext, MasseuseRouter, MasseuseModel, ComputedProperty, ProxyProperty,
             ObserverProperty, RivetsView) {
    'use strict';

    /** @description `Masseuse` is:
     *  BB helper library
     *      helps with
     *          views
     *              baseView
     *                  the BB View lifecycle - based on promises
     *                  child views
     *                  separating View definitions from View options
     *              rivetView
     *                  a baseView with built in rivetjs
     *          models
     *              allows for model specific logic to be packaged with the model
     *                computed properties
     *                proxy properties
     *              nested models with bubbling up of change events
     *          router
     *              with a beforeRouting method
     *
     * @namespace masseuse
     */
    return {
        BaseView : BaseView,
        ViewContext : ViewContext,
        MasseuseModel : MasseuseModel,
        ComputedProperty : ComputedProperty,
        MasseuseRouter : MasseuseRouter,
        ProxyProperty : ProxyProperty,
        ObserverProperty : ObserverProperty,
        utilities : utilities,
        plugins : {
            rivets : {
                RivetsView : RivetsView
            }
        }
    };
});
