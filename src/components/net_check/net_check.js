angular.module('the-utils').directive('netCheck', function($ionicLoading, $timeout) {
  return {
    restrict: 'A',
    scope: {
      netCheck: '=',
      showLoading: '=',
    },
    transclude: true,
    templateUrl: 'the-utils/components/net_check/net_check.html',
    link: function(scope, element, attrs) {
      //    if (scope.showLoading !== false) {
      //        $ionicLoading.show({ scope: scope });
      //      }

      scope.displayConversationsList = function() {
        intercom.displayConversationsList();
      };

      scope.$watch('netCheck', function() {
        scope.errorPage = null;
        try {
          if (scope.netCheck !== null && scope.netCheck !== undefined) {
            //            if (scope.showLoading !== false) {
            //              $ionicLoading.hide();
            //            }

            //            console.log('netCheck: ', scope.netCheck,
            // 'statusText' in scope.netCheck &&
            // Math.floor(scope.netCheck.status / 100) != 2);

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

      element.addClass('ready');

      //      scope.isError =
    },
  };
});
