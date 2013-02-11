app.directive('tsSetSource', ['$timeout', function ($timeout) {
    return function (scope, elm, attrs) {
        scope.$watch(attrs.tsSetSource, function (newVal, oldVal) {
           // log("5","ts-set-source", newVal);
            if (newVal) {

                elm.get(0).src = "https://embed.spotify.com/?uri=" + newVal;

            }
        });
    };
}]);
app.directive('ts-set-height', ['$timeout', function ($timeout) {
    return function (scope, elm, attrs) {
        scope.$watch(attrs.tsSetHeight, function (newVal, oldVal) {
            log("17","ts-set-height",newVal, "");
            if (newVal) {
                elm.css({
                    height:newVal
                });
            }
        });
    };
}]);
app.directive('tsFadeIn', ['$timeout', function ($timeout) {
    return function (scope, elm, attrs) {
        scope.$watch(attrs.tsFadeIn, function (newVal, oldVal) {
            log("28","ts-fade-in",newVal);
            var delay = attrs.tsDelay || 0.5
            var time = attrs.tsTime || 1
            if (newVal) {
                $timeout(function () {
                    elm.defineTransition('none');
                    elm.css({opacity:0, visibility:'visible'})
                });
                $timeout(function () {
                    elm.trans({opacity:1, time:time, ease:CssEase.linear})
                }, delay * 1000);

            } else {
                elm.css({visibility:'hidden'})
            }
        });
    };
}]);


app.directive('tsTest', ['$timeout', function ($timeout) {
    return function (scope, elm, attrs) {
        scope.$watch(attrs.tsTest, function (newVal, oldVal) {
            log("28","ts-test",newVal);

        });
    };
}]);

app.directive('tsToggleClass', ['$timeout', function ($timeout) {
    return function (scope, elm, attrs) {
        scope.$watch(attrs.tsToggleClass, function (newVal, oldVal) {
            try {
                // log("26","","tsToggleClass", "",newVal, oldVal);
                var classes = attrs.tsToggleClassValues.split(",");
                var add = 0, remove = 0;
                if (newVal) {
                    add = 0;
                    remove = 1;
                } else {
                    add = 1;
                    remove = 0;
                }
                if (classes[add]) {
                    elm.addClass(classes[add])
                }
                if (classes[remove]) {
                    elm.removeClass(classes[remove])
                }
            } catch (error) {
                log("169", "tsToggleClass", error);
            }

        });
    };
}]);