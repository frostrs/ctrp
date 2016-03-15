/**
 * PO section of the CTRP app
 */

(function() {
    'use strict';
    angular.module('ctrp.app.po', [
        /* Angular modules */
        'ngTouch',
        'ngAnimate',
        'ngSanitize',
        'angularSpinner',

        /* Cross-app modules */
        'ctrp.module.routes',
        'ctrp.module.constants',
        'ctrp.module.common',
        'ctrp.module.underscoreWrapper',
        'LocalCacheModule',
        'ctrpApp.widgets',
        'ctrp.module.dataservices',
        'ctrp.module.validators',

        /* 3rd-party modules */
        'ui.bootstrap',
        'ngMaterial',
        'toastr',
        'ngFileUpload',
        'angularMoment',
        'ui.grid',
        'ui.grid.pagination',
        'ui.grid.selection',
        'ui.scrollpoint',
        'agGrid',
        'formly',
        'formlyBootstrap'
    ]);
})();
