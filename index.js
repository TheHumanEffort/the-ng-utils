angular.module('the-utils',[]);
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
  this.login = function(hash) {
    return Api.login(hash).catch((x) => {
      ctrl.statusType = 'error';
      ctrl.status = { message: x.message };
    });
  };

  this.recoverPassword = function(hash) {
    return Api.recoverPassword(hash).catch((x) => {
      ctrl.statusType = 'error';
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

            console.log('netCheck: ', scope.netCheck, 'statusText' in scope.netCheck && Math.floor(scope.netCheck.status / 100) != 2);
            scope.loading = false;
            scope.isError = 'statusText' in scope.netCheck && Math.floor(scope.netCheck.status / 100) != 2;

            if (scope.isError) {
              var code = code = scope.netCheck.status;
              if ([0, 404, 500, 403].indexOf(code) != -1) {
                scope.errorPage = 'the-utils/components/net_check/errors/' + code + '.html';
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
$templateCache.put("the-utils/components/net_check/errors/0.html","<i class=\"ion ion-sad-outline\"></i> <h2>No network connection.</h2> <p>Please check your network settings, and try again.<p> ");
$templateCache.put("the-utils/components/net_check/errors/403.html","<i class=\"ion ion-sad-outline\"></i> <h2>Not Allowed</h2> <p>You aren't allowed here, not sure how you got here, though...</p> <button class=\"button button-clear\" ng-click=\"displayConversationsList()\">   Support Chat </button>  ");
$templateCache.put("the-utils/components/net_check/errors/404.html","<i class=\"ion ion-sad-outline\"></i> <h2>Not Found</h2> <p>Unfortunately, we can't find what you're looking for.</p> <p><a ui-sref=\"app.browse\">Browse</a></p> <button class=\"button button-clear\" ng-click=\"displayConversationsList()\">   Support Chat </button> ");
$templateCache.put("the-utils/components/net_check/errors/500.html","<i class=\"ion ion-sad-outline\"></i> <h2>Server Error</h2> <p>Apparently, something went wrong at HQ - we'll look into it ASAP, but feel free to give us more details by contacting us below.</p> <br/> <button class=\"button button-clear\" ng-click=\"displayConversationsList()\">   Support Chat </button> ");
$templateCache.put("the-utils/components/net_check/net_check.html","<div ng-show=\"!loading && isError\" class=\"errorp\">   <div ng-if=\"errorPage\" ng-include=\"errorPage\" class=\"error-page\"></div>   <div ng-if=\"!errorPage\">     <h3>Net error {{ netCheck.status }}</h3>     <p>{{ netCheck.config.url }} : {{ netCheck.statusText }}</p>     <p>{{ netCheck.data.error.description }}</p>   </div> </div> <div ng-show=\"!loading && !isError\" class=\"ng-hide\">   <ng-transclude/> </div> ");
}]);
