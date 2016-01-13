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
angular.module('the-utils').directive('statefulClick', function(Falter) {
  return {
    restrict: 'A',
    /* Doesn't actually care about isolated scope, but these are
    useful to know:
    scope: { statefulClick: '&', statefulClass: '@'
    },*/
    link: function(scope, elem, attrs) {
      function onClick(event) {
        var cl = attrs.statefulClass || 'active';
        elem.addClass(cl);
        var ret = scope.$eval(attrs.statefulClick, { $event: event });

        if (ret && ret.then) {
          ret.then(function(res) {
            elem.removeClass(cl);
          }, function(err) {

            Error.error(err);
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
angular.module("the-utils").run(["$templateCache",function($templateCache) {
}]);
