angular.module('the-utils',[]);
angular.module('the-utils').directive('theError', function() {
  return {
    restrict: 'A',
    scope: {
      theError: '=',
    },
    templateUrl: 'the-utils/components/error/error.html',
    link: function(scope, element, attrs) {
      scope.$watch('theError', function() {
        scope.errorPage = null;
        try {
          if (scope.theError) {
            scope.loading = false;
            scope.isError = 'statusText' in scope.theError && Math.floor(scope.theError.status / 100) != 2;

            if (scope.isError) {
              var code = code = scope.theError.status;
              if ([0, 404, 500, 403].indexOf(code) != -1) {
                scope.errorPage = 'the-utils/components/errors/' + code + '.html';
              }
            }
          } else {
            scope.loading = true;
            scope.isError = false;
          }
        } catch (x) {
          debugger;
        }

      });
    },
  };
});
angular.module('the-utils').service('Falter',function() {
  var Falter = {
    exception: function(exception,context) {

    },
    network: function(networkError,context) {

    },
    error: function(context) {

    }
  };

  return window.Falter = Falter;
});
// LoginCtrl:
// LoginCtrl is a simple way to manage login forms, because, let's face it,
// they're all pretty similar.  The idea is to provide login and password
// reset functionality.
//
// Ins:
//
// controller.login(hash) and controller.recoverPassword(hash) do what you
// would think, and return promises that resolve or reject depending on what
// happens. You can pay close attention tot the resolutions or rejections in
// your code (not recommended), or bind things to the various out fields
// described below.
//
// controller.validate(hash) performs on-the-fly local validation of the users
// input.
//
// Outs:
//
// controller.invalid: will be a hash of validation messages for any fields you
// passed to login or recoverPassword - these might be returned from inside
// CoginCtrl, or from your server.  Null = OK.  String value = validation
// message.
//
// controller.statusType: 'error', 'progress', null
//
// controller.status: hash that includes 'message', 'progress' (0 to 1,
// or 'indeterminate')
//
// Events - events are triggered on the scope.
//

angular.module('the-utils').controller('UtilsLoginCtrl', function(Api, $scope) {
  var ctrl = this;
  ctrl.statusType = 'status';
  ctrl.status = { message: 'Ready to log in!' };

  this.login = function(hash) {
    ctrl.statusType = 'status';
    ctrl.status = { message: 'Checking password...' };

    return Api.login(hash).then(
      () => {
        ctrl.statusType = 'status';
        ctrl.status = { message: 'Logging in...' };
      },

      (x) => {
        ctrl.statusType = 'error';
        ctrl.status = { message: x.message };
      });
  };

  this.recoverPassword = function(hash) {
    return Api.recoverPassword(hash).catch((x) => {
      ctrl.statusType = 'error';
      console.log(x);
      ctrl.status = { message: x };
    });
  };

  this.invalid = {};
  this.statusType = null;
  this.status = { message: 'Ready to log in!' };

  var updateStatus = (type, hash) => {
    this.statusType = type;
    this.status = hash;
  };

  Api.on('status', updateStatus);
  $scope.$on('$destroy', () => { Api.off('status', updateStatus); });

});
angular.module('the-utils').directive('netCheck', function($ionicLoading) {
  return {
    restrict: 'A',
    scope: {
      netCheck: '=',
      showLoading: '=',
    },
    transclude: true,
    templateUrl: 'the-utils/components/net_check/net_check.html',
    link: function(scope, element, attrs) {
      if (scope.showLoading !== false) {
        // $ionicLoading.show( { scope : scope });
      }

      scope.displayConversationsList = function() {
        intercom.displayConversationsList();
      };

      scope.$watch('netCheck', function() {
        scope.errorPage = null;
        try {
          if (scope.netCheck) {
            if (scope.showLoading !== false) {
              //  $ionicLoading.hide();
            }

            //            console.log('netCheck: ', scope.netCheck, 'statusText' in scope.netCheck && Math.floor(scope.netCheck.status / 100) != 2);
            scope.loading = false;
            scope.isError = 'statusText' in scope.netCheck && Math.floor(scope.netCheck.status / 100) != 2;

            if (scope.isError) {
              var code = code = scope.netCheck.status;
              if ([0, 404, 500, 403].indexOf(code) != -1) {
                scope.errorPage = 'the-utils/components/errors/' + code + '.html';
              }
            }
          } else {
            scope.loading = true;
            scope.isError = false;
          }
        } catch (x) {
          debugger;
        }

      });

      //      scope.isError =
    },
  };
});
import _ from 'lodash';

angular.module('the-utils').directive('netClick', function() {
  return {
    restruct: 'A',
    /*    scope: {
          netClick: '&',
        }, */
    transclude: true,
    templateUrl: 'the-utils/components/net_click/net_click.html',
    link: function(scope, elem, attrs) {
      function onClick(event) {
        scope.netError = null;
        scope.error = null;
        scope.tmpl = null;

        var cl = attrs.statefulClass || 'active';
        elem.addClass(cl);
        var ret = scope.$eval(attrs.netClick, { $event: event });

        if (ret && ret.then) {
          ret.then(function(res) {
            elem.removeClass(cl);
          }, function(err) {

            if ('statusText' in err && Math.floor(err.status / 100) != 2) {
              scope.netError = err;
              var code = code = err.status;
              if ([0, 404, 500, 403].indexOf(code) != -1) {
                scope.tmpl = 'the-utils/components/errors/' + code + '.html';
              }
            } else if ('meta' in err && err.meta.error == 'invalid') {
              scope.tmpl = 'the-utils/components/errors/invalid.html';
              scope.error = { keys: _.keys(err.meta.messages), object: err };
            } else {
              scope.error = err;
            }

            elem.removeClass(cl);
          });
        } else {
          elem.removeClass(cl);
        }
      }

      elem.on('click', onClick);

      scope.$on('$destroy', function() {
        elem.off('click', onClick);
      });
    },
  };
});
angular.module('the-utils').directive('theRefresher', function() {
  console.log('LOADING REFRESHER');
  return {
    restrict: 'E',
    scope: {
      resource: '=',
      onRefresh: '&',
    },
    transclude: true,
    templateUrl: 'the-utils/components/refresher/refresher.html',
    link: function(scope, element, attrs) {

      scope.refresh = function() {
        let p;
        scope.error = null;

        if (attrs.onRefresh) {
          p = scope.onRefresh({ });
        } else if (scope.resource) {
          p = scope.resource.DSRefresh();
        }

        p.catch((err) => scope.error = err)
          .finally((res) => scope.$broadcast('scroll.refreshComplete'));
      };

    },
  };
});
// UtilsSignupCtrl:
// UtilsSignupCtrl is a simple way to manage signup forms, because, let's face it,
// they're all pretty similar.
//
// Ins:
//
// controller.signup(hash) does what you would think, and return promises that
// resolve or reject depending on what happens. You can pay close attention to
// the resolutions or rejections in your code (not recommended), or bind things
// to the various out fields described below.
//
// controller.validate(hash) performs on-the-fly local validation of the users
// input.
//
// Outs:
//
// controller.invalid: will be a hash of validation messages for any fields you
// passed to signup - these might be returned from inside UtilsSignupCtrl, or
// from your server.  Null = OK.  String value = validation message.
//
// controller.statusType: 'error', 'progress', null
//
// controller.status: hash that includes 'message', 'progress' (0 to 1,
// or 'indeterminate')
//
// Events - events are triggered on the scope.
//

angular.module('the-utils').controller('UtilsSignupCtrl', function(Api, $scope) {
  var _this = this;

  this.signup = function(hash) {
    return Api.signup(hash).catch((x) => {
      if (x.type == Api.ERROR_VALIDATION_FAILED) {
        _this.invalid = x.data;
      } else {
        _this.statusType = 'error';
        _this.status = { message: x.message };
      }
    });
  };

  this.recoverPassword = function(hash) {
    return Api.recoverPassword(hash).catch((x) => {
      _this.statusType = 'error';
      _this.status = { message: x };
    });
  };

  this.invalid = {};
  this.statusType = null;
  this.status = { message: 'Ready to log in!' };

  var updateStatus = (type, hash) => {
    this.statusType = type;
    this.status = hash;
  };

  Api.on('status', updateStatus);
  $scope.$on('$destroy', () => { Api.off('status', updateStatus); });

});
angular.module('the-utils').directive('statefulClick', function (Falter) {
  return {
    restrict: 'A',
    /* Doesn't actually care about isolated scope, but these are
    useful to know:
    scope: { statefulClick: '&', statefulClass: '@'
    },*/
    link: function (scope, elem, attrs) {
      function onClick(event) {
        var cl = attrs.statefulClass || 'active';
        elem.addClass(cl);
        var ret = scope.$eval(attrs.statefulClick, { $event: event });

        if (ret && ret.then) {
          ret.then(function (res) {
            elem.removeClass(cl);
          }, function (err) {

            Falter.error(err);
            elem.removeClass(cl);
          });
        } else {
          elem.removeClass(cl);
        }
      }

      elem.on('click', onClick);

      scope.$on('$destroy', function () {
        elem.off('click', onClick);
      });
    },
  };
});
angular.module("the-utils").run(["$templateCache",function($templateCache) {
$templateCache.put("the-utils/components/error/error.html","<span ng-if=\"errorPage\" ng-include=\"errorPage\" class=\"error-page\"></span> ");
$templateCache.put("the-utils/components/errors/0.html","<i class=\"ion ion-sad-outline\"></i> <h2>No network connection.</h2> <p>Please check your network settings, and try again.<p> ");
$templateCache.put("the-utils/components/errors/403.html","<i class=\"ion ion-sad-outline\"></i> <h2>Not Allowed</h2> <p>You aren't allowed here, not sure how you got here, though...</p> <button class=\"button button-clear\" ng-click=\"displayConversationsList()\">   Support Chat </button>  ");
$templateCache.put("the-utils/components/errors/404.html","<i class=\"ion ion-sad-outline\"></i> <h2>Not Found</h2> <p>Unfortunately, we can't find what you're looking for.</p> <p><a ui-sref=\"app.browse\">Browse</a></p> <button class=\"button button-clear\" ng-click=\"displayConversationsList()\">   Support Chat </button> ");
$templateCache.put("the-utils/components/errors/500.html","<i class=\"ion ion-sad-outline\"></i> <h2>Server Error</h2> <p>Apparently, something went wrong at HQ - we'll look into it ASAP, but feel free to give us more details by contacting us below.</p> <br/> <button class=\"button button-clear\" ng-click=\"displayConversationsList()\">   Support Chat </button> ");
$templateCache.put("the-utils/components/errors/invalid.html","<i class=\"ion ion-sad-outline\"></i> <h2>Invalid {{ error.keys }}</h2> <p>Please check for errors and try again.<p> ");
$templateCache.put("the-utils/components/net_check/net_check.html","<div ng-show=\"!loading && isError\" class=\"errorp\">   <div ng-if=\"errorPage\" ng-include=\"errorPage\" class=\"error-page\"></div>   <div ng-if=\"!errorPage\">     <h3>Net error {{ netCheck.status }}</h3>     <p>{{ netCheck.config.url }} : {{ netCheck.statusText }}</p>     <p>{{ netCheck.data.error.description }}</p>   </div> </div> <div ng-show=\"!loading && !isError\" class=\"ng-hide\">   <ng-transclude/> </div> ");
$templateCache.put("the-utils/components/net_click/net_click.html","<span ng-show=\"!netError && !error\">   <ng-transclude /> </span> <span ng-show=\"netError\" class=\"ng-hide\" >   <span ng-if=\"tmpl\" ng-include=\"tmpl\"></span> </span> <span ng-show=\"error\" class=\"ng-hide\">   <span ng-if=\"tmpl\" ng-include=\"tmpl\"></span>   <span ng-if=\"!tmpl\">     {{ error }}   </span> </span> ");
$templateCache.put("the-utils/components/refresher/refresher.html","<ion-refresher on-refresh=\"refresh()\" pulling-text=\"Pull to refresh...\"> </ion-refresh>      ");
}]);
