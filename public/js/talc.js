app.service('talc', function() {

    var self = this;

    self.createObject = function($scope) {
        $scope.talc = {};


        var csvfile = "TALC.csv";
        $.get(csvfile, function(data) {
            var results = $.parse(data);

            angular.forEach(results.results.rows, function(v, k) {
                //remove percentage needed
                $scope.talc[v.Youngest] = v.TALC

            



            })

        })

      
    }


})