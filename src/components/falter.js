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
