(function() {
  'use strict';

  angular.module('ctrpApp.widgets',[
    //angular modules
    'ngTouch',
    'ngAnimate',
    'ngSanitize',
    'ngMaterial',
    'ngMdIcons',

    //third-party modules
    'angularMoment',

    //ctrp modules
    'ctrpApp',
    'ctrp.commonTools',
    'ctrp.constants',
    'PromiseTimeoutModule'
  ]);

})();
