// Define the `MultitenantApp` module
var MultitenantApp = angular.module('MultitenantApp', ['ngAnimate','ngMessages', 'ui.router', 'oc.lazyLoad', 'toastr']);

MultitenantApp.constant('API_URL', '');

MultitenantApp.constant('AUTH_EVENTS', {
    notAuthorized: 'auth-not-authorized',
    fatalError: 'auth-fatal-error',
    authenticated: 'auth-authenticated'
});

// angular toaster config
MultitenantApp.config(function (toastrConfig) {
    angular.extend(toastrConfig, {
        closeButton: true,
        progressBar: true,
        preventDuplicates: true,
        newestOnTop: true,
        target: 'body'
    });
});

// ocLazyLoad Config
MultitenantApp.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        debug: true
    });
}]);

// ui router Config
MultitenantApp.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/login.html');

    $stateProvider
        .state('accueil', {
            url: "/accueil.html",
            templateUrl: "views/accueil.html",
            controller: "AccueilController",
            resolve: {
                user: function ($http, $rootScope, AUTH_EVENTS) {
                    return $http.get("/api/whoami").then(function (res) {
                        $rootScope.$broadcast(AUTH_EVENTS.authenticated, {user: res.data.data});
                    });
                },
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MultitenantApp',
                        files: [
                            'controllers/AccueilController.js'
                        ]
                    });
                }]
            }
        })
        .state('customers', {
            url: "/customers.html",
            templateUrl: "views/customers.html",
            controller: "CustomersController",
            resolve: {
                user: function ($http, $rootScope, AUTH_EVENTS) {
                    return $http.get("/api/whoami").then(function (res) {
                        $rootScope.$broadcast(AUTH_EVENTS.authenticated, {user: res.data.data});
                    });
                },
                customers: function ($http) {
                    return $http.get("/api/getAllCustomers");
                },
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MultitenantApp',
                        files: [
                            'controllers/CustomersController.js'
                        ]
                    });
                }]
            }
        })
        .state('create_customer', {
            url: "/create_customer.html",
            templateUrl: "views/create_customer.html",
            controller: "CreateCustomerController",
            resolve: {
                user: function ($http, $rootScope, AUTH_EVENTS) {
                    return $http.get("/api/whoami").then(function (res) {
                        $rootScope.$broadcast(AUTH_EVENTS.authenticated, {user: res.data.data});
                    });
                },
                customers: function ($http) {
                    return $http.get("/api/getAllCustomers");
                },
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MultitenantApp',
                        files: [
                            '../bower_components/ng-password-generator/ng-password-generator.js',
                            '../bower_components/angular-password/angular-password.min.js',
                            'controllers/CreateCustomerController.js'
                        ]
                    });
                }]
            }
        })
        .state('login', {
            url: "/login.html",
            templateUrl: "views/login.html",
            controller: "LoginController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MultitenantApp',
                        files: [
                            'assets/css/login.css',
                            'controllers/LoginController.js'
                        ]
                    });
                }]
            }
        });

});

MultitenantApp.run(function ($rootScope, $state) {
    console.log("MultitenantApp.run() ...");
    // state to be accessed from view
    $rootScope.$state = $state;
    // null means that we don't know if the user is
    // logged in or no (we have to query auth/whoami to know)
    $rootScope.user = null;
});