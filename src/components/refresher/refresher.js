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
