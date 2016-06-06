app.service('curves', function() {
        var self = this;

        self.curves = function($scope) {
            var csvfile = "curves.csv";
            $.get(csvfile, function(data) {
                    var results = $.parse(data);
                    angular.forEach(results.results.fields, function(a, b) {   
                    if(a.toString().toLowerCase().search("empty") == -1){              
                        $scope.curves[a] = []
                    }
                    })  
                    angular.forEach(results.results.rows, function(a, b) {
                            angular.forEach(a, function(v, k) {
                                    if(k.toString().toLowerCase().search("empty") == -1){
                                    if (Date.parse(a[k]) && !a[k]/1 && a[k] != 0) {          
                                        var temp = new Date(a[k])                                       
                                            $scope.curves[k].push(temp)
                                        } else {
                                            if (a[k].toString().search("%") > 0) {
                                                $scope.curves[k].push(a[k].replace(/%/i, '') / 100)
                                        } else {
                                              $scope.curves[k].push(a[k])
                                            }
                                        }
                                        }
                                    })
                            });
                    self.alignDate($scope)
                 
                 
                    })          
                }
       self.alignDate= function($scope){
            $scope.curves.Lookup = [];
         for(var l =0; l < $scope.curves.Date.length; l ++){
            var tmp = new Date($scope.curves.Date[l])
            $scope.curves.Lookup.push(tmp.getMonth() + 1 + "_" + tmp.getFullYear())
         }
  

           
       }         





});