// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'ngAnimate', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $ionicPopup) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    // setup an abstract state for the tabs directive
    .state('home', {
      url: "/home",
      templateUrl: "templates/home.html",
      controller: 'DashCtrl'
    })

    .state('about', {
      url: "/about",
      templateUrl: "templates/about.html",
    })    
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home');

});

angular.module('configuration', ['ionic', 'ngAnimate', 'starter.controllers', 'starter.services'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('settings', {
      url: "/settings",
      templateUrl: "templates/settings.html",
      controller: 'SettingsCtrl'
    })
  $urlRouterProvider.otherwise('/settings');
});

angular.module('contact', ['ionic', 'ngAnimate', 'starter.controllers', 'starter.services'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('contact', {
      url: "/contact",
      templateUrl: "templates/contact_form.html",
      controller: 'ContactCtrl'
    })
  $urlRouterProvider.otherwise('/contact');
});

angular.module('vehicle_denouncement', ['ionic', 'ngAnimate', 'starter.controllers', 'starter.services'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('denouncement', {
      url: "/denouncement",
      templateUrl: "templates/vehicle_form.html",
      controller: 'VehicleDenouncementCtrl'
    })
  $urlRouterProvider.otherwise('/denouncement');
});

angular.module('info_request', ['ionic', 'ngAnimate', 'starter.controllers', 'starter.services'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('info_request', {
      url: "/info_request",
      templateUrl: "templates/request_form.html",
      controller: 'InfoRequestCtrl'
    })
  $urlRouterProvider.otherwise('/info_request');
});

angular.module('gas_station_list', ['ionic', 'ngAnimate', 'starter.controllers', 'starter.services'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('gas_station_list', {
      url: "/gas_station_list",
      templateUrl: "templates/stations.html",
      controller: 'StationListCtrl'
    })
  $urlRouterProvider.otherwise('/gas_station_list');
});

angular.module('gas_station_detail', ['ionic', 'ngMap', 'ngAnimate', 'starter.controllers', 'starter.services'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('gas_station_detail', {
      url: "/gas_station_detail",
      templateUrl: "templates/station.html",
      controller: 'StationDetailCtrl'
    })
  $urlRouterProvider.otherwise('/gas_station_detail');
});
