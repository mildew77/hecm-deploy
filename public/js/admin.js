app.service('admin', function() {

    var self = this;

    self.createObject = function($scope) {
        $scope.admin = {};

        var csvfile = "admin.csv";
        $.get(csvfile, function(data) {
            
            var results = $.parse(data);
            angular.forEach(results.results.rows, function(v, k) {
                //remove percentage needed


                if (v.Value.toString().search("%") > 0) {
                    $scope.admin[v.Key] = v.Value.replace(/%/i, '') / 100
                }else if(v.Value.toString().toLowerCase()=="false" || v.Value.toString().toLowerCase()=="no"){

                	$scope.admin[v.Key] = false
                } else if(v.Value.toString().toLowerCase()=="true" || v.Value.toString().toLowerCase()=="yes"){
                    $scope.admin[v.Key] = true
                }
                else {
                    $scope.admin[v.Key] = v.Value
                }






            })

        })

      
    }


})