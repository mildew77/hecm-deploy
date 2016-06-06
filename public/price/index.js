var app = angular.module('hecmModel', ['app.directives'])
app.controller('MainCtrl', function($scope,$http,uploadLoans,curves,price,admin,lesa,talc,servicing,exportCSV) {
    $scope.inputFileDisplay = 'Select CSV file to Upload';
    $scope.showUpload = true;
    $scope.showLoans = false;
    $scope.showStats= false;
    $scope.download=false;
    $scope.loanTable = false;
    $scope.loanDetails = true;
    $scope.loanStats = false;
    $scope.currentPage = 0;
    $scope.filterContainer = {};
    $scope.statsContainer = {};
    $scope.curves ={};
    $scope.pageLimit = 0;
    $scope.sortBoolean = true;
    $scope.modalCheck = true;
    $scope.PriceWAL =false;

    $scope.pageLimitUpdate = function() {
        $scope.pageLimit = Math.ceil($scope.loanCount / $scope.data.selectedOption.id);
        $scope.currentPage = 0;
    };
    $scope.loanCount = 0;

$scope.loans=[];


//Updatable pricing variables   //
//..............................//
$scope.annualMIP = .0125;
$scope.prepayTuner = 1;
$scope.isThisWorking =3;



//.................................//
 $scope.testVariable = "capitalize"


$scope.headerInclusionInitial = [
                    
                        'Loan Number',
                        'Funded Date',
                        'Initial Rate',
                        'Youngest DOB',
                        'Program',
                        'Rate / Margin',
                        'MCA',
                        'UPB',
                        'Principal Limit',
                        'Payment Plan',
                        'Monthly Payment',
                        'Term Length (Mos)',                        
                        ] ; 

 $scope.headerFormatInitial =[
                        'loanNumber',
                        'loanDate',
                        'percentage',
                        'loanDate',
                        'capitalize',
                        'percentage',
                        'loanCurrency',
                        'loanCurrency',
                        'loanCurrency',
                        'capitalize',
                        'loanNumber',
                        'loanNumber'

 ]

 $scope.headerInclusion = $scope.headerInclusionInitial.slice(0)
 $scope.headerFormat =  $scope.headerFormatInitial.slice(0)

  admin.createObject($scope);  
  lesa.createObject($scope);    
  talc.createObject($scope);                 

  curves.curves($scope);


$scope.sortFields = function(fieldValue){
    console.log(typeof $scope.loans[0][fieldValue.target.innerText])

 if(typeof $scope.loans[0][fieldValue.target.innerText] == "string"){
    if($scope.sortBoolean){
         $scope.sortBoolean = false;
          $scope.loans.sort(function(a, b){
    if(a[fieldValue.target.innerText] < b[fieldValue.target.innerText]) return -1;
    if(a[fieldValue.target.innerText] > b[fieldValue.target.innerText]) return 1;
    return 0;
})


    }else{
        $scope.sortBoolean = true;
     $scope.loans.sort(function(a, b){
    if(a[fieldValue.target.innerText] > b[fieldValue.target.innerText]) return -1;
    if(a[fieldValue.target.innerText] < b[fieldValue.target.innerText]) return 1;
    return 0;
})

    }



 } else{

    if($scope.sortBoolean){
    $scope.sortBoolean = false;
        $scope.loans.sort(function(a, b){
 return a[fieldValue.target.innerText]-b[fieldValue.target.innerText]
})

}else{
    $scope.sortBoolean = true
        $scope.loans.sort(function(a, b){
 return b[fieldValue.target.innerText]-a[fieldValue.target.innerText]
})

}


 }  







}

$scope.price= function(){
$scope.modalCheck = false;

 $scope.startModal()


 setTimeout(function(){

price.price($scope);
servicing.servicing($scope);


$scope.modalCheck = true;

if($scope.headerInclusion.indexOf('Price')<0){
$scope.headerInclusion.push('Price');
 $scope.headerFormat.push('percentage')
$scope.loanInfo.fields .push({field: 'Price', include: true})
$scope.download = true;

$scope.statsContainer.Price = [];
$scope.statsContainer.WAL = [];
angular.forEach($scope.statsContainer.programs, function(h,i){
    $scope.statsContainer.Price.push(0)
    $scope.statsContainer.WAL.push(0)
})
angular.forEach($scope.loans, function(e,f){
    var tempLookup= $scope.statsContainer.programs.indexOf(e['Program']) 
    $scope.statsContainer.Price[tempLookup] += (e.Price * e.UPB);
    $scope.statsContainer.WAL[tempLookup] += (e['Weighted Average Life']  * e.UPB)
})

$scope.PriceWAL = true;


$scope.$apply() 
}


 }, 1000);




console.log($scope.statsContainer)
console.log($scope.loans)


}


$scope.downloadFile =  function(){

            var arrOfFields = [
                'Loan Number',
                'Price',
                'Weighted Average Life'
        ]

exportCSV.exportCSV($scope,'testing',arrOfFields);


}
    $scope.filterTest = "number:0";
    $scope.data = {
        availableOptions: [{
            id: '10',
            name: 'Show 10 Results'
        }, {
            id: '25',
            name: 'Show 25 Results'
        }, {
            id: '50',
            name: 'Show 50 Results'
        }],
        selectedOption: {
            id: '50',
            name: 'Show 10 Results'
        } //This sets the default value of the select in the ui
    };



    $scope.nextPage = function() {

        if ($scope.currentPage + 1 == $scope.pageLimit) {

            $scope.currentPage = $scope.pageLimit - 1;
        } else {
            $scope.currentPage = $scope.currentPage + 1
        }


    }
    $scope.previousPage = function() {
        if ($scope.currentPage == 0) {
            $scope.currentPage = 0;
        } else {
            $scope.currentPage = $scope.currentPage - 1
        }
    }

//http://codepen.io/bseth99/pen/BmHcF
    $('.js-loading-bar').modal({
        backdrop: 'static',
        show: false
    });

    $scope.modal = function() {
        var $modal = $('.js-loading-bar'),
            $bar = $modal.find('.progress-bar');

        $modal.modal('show');
        $bar.addClass('animate');

        setTimeout(function() {
            $bar.removeClass('animate');
            $modal.modal('hide');
        }, 1500);

    }

    $scope.startModal = function(){
        $scope.modalCheck = false;
         var $modal = $('.js-loading-bar'),
            $bar = $modal.find('.progress-bar');

        $modal.modal('show');
        $bar.addClass('animate');

        var timer = setInterval(stop, 1000);

        function stop(){
            if($scope.modalCheck){
            $bar.removeClass('animate');
            $modal.modal('hide');
            clearInterval(timer);
            }
          

        }



    }



    $scope.displayUpload = function() {

        $scope.showUpload = true;
        $scope.loanTable = false;
    

    }
    $scope.viewLoanInfo = function() {
        $scope.loanTable = true;
        $scope.showUpload = false;
        $scope.loanDetails = true;
        $scope.loanStats = false;

    }

    $scope.stats = function() {
        $scope.loanDetails = false;
        $scope.loanStats = true;

    }



    $("input:file").change(function() {
        $scope.download=false;
        $scope.loans=[];
        $scope.headerInclusion = [];
        $scope.headerFormat = [];

        $scope.headerInclusion = $scope.headerInclusionInitial.slice(0)
        $scope.headerFormat =  $scope.headerFormatInitial.slice(0)

    	uploadLoans.uploadLoans(this,$scope);      


           
    });



});


