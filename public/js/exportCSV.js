app.service('exportCSV', function() {
    "use strict";
    var self = this;



   self.exportCSV = function($scope,name,fieldArr){

 

   	        var exportCSV = []
         angular.forEach($scope.loans, function(x,y){
            var temp = {};

            angular.forEach(fieldArr, function(d,j){

           temp[d]=x[d];
         
            })

            exportCSV.push(temp)
           
   

         })


         var csvArr = Baby.unparse(exportCSV);


           self.export(csvArr,name)


   }



   self.export = function(arr,name) {
        //arr is array with headers as [0]

        window.URL = window.webkitURL || window.URL;

        var contentType = 'text/csv';

        var csvFile = new Blob([arr], {
            type: contentType
        });

        var a = document.createElement('a');
        a.download = name + '.csv';
        a.href = window.URL.createObjectURL(csvFile);
        a.textContent = 'Download CSV';

        a.dataset.downloadurl = [contentType, a.download, a.href].join(':');
        a.click()

    }
})