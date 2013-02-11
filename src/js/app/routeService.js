app.factory('routeService', ['$timeout', '$location', function ($timeout, $location) {

    var service = {};
    /*
     * @description redirect to a new view by changing the location hash.
     * @usage service.redirectTo(['mytheme', 'myalbum']);
     * @param arr Array The values to make up the new address.
     *
     */
    service.redirectTo = function(arr){

        var hash = "";
        if(arr)
            hash = arr.length > 0 ? arr.join("/") : "";
        $timeout(function(){ $location.path( hash ); });
    };


    return service;


}]);