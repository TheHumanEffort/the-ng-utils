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
