app.service('lesa', function() {

    var self = this;

    self.createObject = function($scope) {
        $scope.lesa = [];


        var csvfile = "LESA.csv";
        $.get(csvfile, function(data) {
            var results = $.parse(data);

            angular.forEach(results.results.rows, function(v, k) {
                //remove percentage needed
               $scope.lesa.push(v)

            



            })

        })

      
    }


})