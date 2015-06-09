/**
 * Created by wangg5 on 6/1/15.
 */

(function() {
    'use strict';

    angular.module('ctrpApp', [
        'ui.router',
        'Constants',
        'PromiseServiceModule',
        'LocalCacheModule',
        'ngAnimate',
        'toastr'
    ])
        .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

            $httpProvider.defaults.useXDomain = true;
            //  $httpProvider.defaults.withCredentials = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
            //    $httpProvider.interceptors.push('AuthInterceptor');

            $urlRouterProvider.otherwise('/main/welcome');

            $stateProvider.state('main', {
                url: '/main',
                views: {
                    '': {
                        templateUrl: 'angular/partials/main_content_frame.html'
                    },

                    'right_panel@main': {
                        templateUrl: 'angular/partials/right_panel.html'
                    },

                    'main_content@main': {
                        templateUrl: 'angular/partials/main_content.html'
                    }
                }
            })

                .state('main.defaultContent', {
                    url: '/welcome',
                    templateUrl: 'angular/partials/welcome_content.html'
                })

                .state('main.organizations', {
                    url: '/organizations',
                    templateUrl: 'angular/partials/organization_list.html',
                    controller: 'organizationCtrl as orgsView'
                })

                .state('main.orgDetail', {
                    url: '/organizations/:orgId',
                    templateUrl: 'angular/partials/orgDetails.html',
                    controller: 'orgDetailCtrl as orgDetailView',
                    resolve: {
                        OrgService : 'OrgService',
                        orgDetailObj : function($stateParams, OrgService) {
                            return OrgService.getOrgById($stateParams.orgId);
                        }
                    } //resolve the promise and pass it to controller
                })

                .state('main.addOrganization', {
                    url: '/new_organization',
                    templateUrl: 'angular/partials/orgDetails.html',
                    controller: 'orgDetailCtrl as orgDetailView',
                    resolve: {
                        orgDetailObj: function($q) {
                            var deferred = $q.defer();
                            deferred.resolve(null);
                            return deferred.promise;
                        }
                    }
                })



        }).run(function() {
            console.log('running ctrp angular app');
        });



})();
