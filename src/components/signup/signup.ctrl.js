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
