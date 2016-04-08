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
