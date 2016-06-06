app.service('trades', function() {
    this.uploadTrades = function($scope) {


        var csvfile = "trades.csv";


        $.get(csvfile, function(data) {
            $scope.trades.data = [];
 
            var results = $.parse(data);
            var keepGoing = true;
           
            $scope.trades.fields = results.results.fields;
            $scope.trades.fields.unshift('Fill Now');

            angular.forEach(results.results.rows, function(v, k) {
                if(!v.Pool){keepGoing = false}
                    else{keepGoing = true};
                if(keepGoing){
                var temp={};


                temp.fill= false;
                temp.pool = v.Pool;
                temp.product = v.Product;
                temp.UPB = v.UPB.replace(/[^0-9.]/g, '')/1;
                temp.age = v.Age;
                temp.price = v.Price;

                 
             

                if (v['H2H Refi'].search("%") > 0 || v['H2H Refi'].replace(/[^0-9.]/g, '') > 1) {
                     temp.refi = v['H2H Refi'].replace(/[^0-9.]/g, '') / 100;

                } else {
                    temp.refi = v['H2H Refi'].replace(/[^0-9.]/g, '')
                }
                if (v['PLU'].search("%") > 0 || v['PLU'].replace(/[^0-9.]/g, '') > 1) {
                    temp.PLU = v['PLU'].replace(/[^0-9.]/g, '') / 100

                } else {
                    temp.PLU = v['PLU'].replace(/[^0-9.]/g, '')
                }
                 if (v['GWAM'].toString().search("%") > 0 || v['GWAM'].toString().replace(/[^0-9.]/g, '') > 1) {
                    temp.WAM = v['GWAM'].toString().replace(/[^0-9.]/g, '') / 100

                } else {
                    temp.WAM = v['GWAM'].toString().replace(/[^0-9.]/g, '')
                }
                 if (v['UPB Variance'].toString().search("%") > 0 || v['UPB Variance'].toString().replace(/[^0-9.]/g, '') > 1) {
                    temp['UPB Variance'] = v['UPB Variance'].toString().replace(/[^0-9.]/g, '') / 100

                } else {
                    temp['UPB Variance'] = v['UPB Variance'].toString().replace(/[^0-9.]/g, '')
                }
                 if (v['GWAM Variance'].toString().search("%") > 0 ) {
                    temp['GWAM Variance'] = v['GWAM Variance'].toString().replace(/[^0-9.]/g, '') / 100

                } else if(v['GWAM Variance'].toString().toLowerCase().search("b") > 0 ){
                        temp['GWAM Variance'] = v['GWAM Variance'].toString().replace(/[^0-9]/g, '') / 10000
                }else {
                    temp['GWAM Variance'] = v['GWAM Variance'].toString().replace(/[^0-9.]/g, '')/1
                }
                      if (v['Age Variance'].toString().search("%") > 0 ) {
                    temp['Age Variance'] = (v['Age Variance'].toString().replace(/[^0-9.]/g, '') / 100) * v.Age;

                } else {
                    temp['Age Variance'] = v['Age Variance'].toString().replace(/[^0-9.]/g, '')/1
                }
                 if (v['PLU Variance'].toString().search("%") > 0 || v['PLU Variance'].toString().replace(/[^0-9.]/g, '') > 1) {
                    temp['PLU Variance'] = v['PLU Variance'].toString().replace(/[^0-9.]/g, '') / 100

                } else {
                    temp['PLU Variance'] = v['PLU Variance'].toString().replace(/[^0-9.]/g, '')
                }
               
               


                   temp.counterParty = v.Counterparty;

             temp.settle = new Date(v.Settle);

             $scope.trades.data.push(temp);


             }

            })

      

        });


    }

});