var app = angular.module('hecmModel', ['app.directives'])
app.controller('MainCtrl', function($scope,$http,uploadLoans,trades,curves,price,pooling) {
    $scope.inputFileDisplay = 'Select CSV file to Upload';
    $scope.showUpload = true;
    $scope.showLoans = false;
    $scope.showTrades= true;
    $scope.loanTable = false;
    $scope.tradeTable = false;
    $scope.loanDetails = true;
    $scope.tradeDetails=false;
    $scope.loanStats = false;
    $scope.buyUpBuyDown = new Number(6);
    $scope.currentPage = 0;
    $scope.filterContainer = {};
    $scope.statsContainer = {};
    $scope.curves ={};
    $scope.trades ={};
    $scope.pageLimit = 0;
    $scope.pageLimitUpdate = function() {
        $scope.pageLimit = Math.ceil($scope.loanCount / $scope.data.selectedOption.id);
        $scope.currentPage = 0;
    };
    $scope.loanCount = 0;

$scope.header = {};
$scope.headerInclusion =['Loan Number',
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
                        'Repair Set Aside',
                        'Ready to Pool'
                        ]    

$scope.loans=[];
//Updatable pricing variables   //
//..............................//
$scope.annualMIP = .0125;
$scope.prepayTuner = 1;



//.................................//
  curves.curves($scope);

  trades.uploadTrades($scope);



$scope.allocate= function(){
pooling.bestEx($scope);
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



    $scope.displayUpload = function() {
        $scope.showUpload = true;
        $scope.loanTable = false;
        $scope.tradeTable = false;
    }
    $scope.viewLoanInfo = function() {
        $scope.loanTable = true;
        $scope.showUpload = false;
        $scope.loanDetails = true;
        $scope.loanStats = false;
        $scope.tradeTable = false;
    }
      $scope.viewTrades = function() {
         $scope.showTrades = true;
        $scope.loanTable = false;
        $scope.showUpload = false;
        $scope.loanStats = false;
        $scope.tradeTable = true;
        $scope.tradeDetails = true;
    }

    $scope.stats = function() {
        $scope.loanDetails = false;
        $scope.loanStats = true;
    }



    $("input:file").change(function() {
    	uploadLoans.uploadLoans(this,$scope);   
                   
    });



});

app.filter('percentage', ['$filter',
    function($filter) {
        return function(input, decimals) {
            return $filter('number')(input * 100, decimals) + '%';
        };
    }
]);




