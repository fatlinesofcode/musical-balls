app.controller('AppController', ['$scope', '$timeout', '$rootScope', 'apiService', function AppController($scope, $timeout, $rootScope, apiService) {

        /* structure hack for intellij structrue panel */
    var self = this;
    if (true)self = $scope;
    /* end */

    self.initialize = function () {
        log("8","AppController","initialize", "");
        toggleListeners(true);
    };
    var toggleListeners = function (enable) {
        self.$on('$destroy', onDestroy)

    };
    var onDestroy = function (enable) {
        toggleListeners(false);
    };

    self.refresh = function() {
        $timeout(function(){
        });
    }
    self.redirectTo = function(address){
        log("29","AppController","redirectTo", address, Config.REQUEST_STRING);
        window.location = Config.ROOT_PATH + 'site/'+address+Config.REQUEST_STRING;
    }


    self.initialize();
    return self;
}]);