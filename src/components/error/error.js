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
