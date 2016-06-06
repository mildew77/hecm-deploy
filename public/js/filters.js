
app.filter('percentage', ['$filter',
    function($filter) {
       var decimals =3
        return function(input, decimals) {
            return $filter('number')(input * 100, decimals) + '%';
        };
    }
]);






app.filter('loanNumber', ['$filter',
    function($filter) {
        return function(input, decimals) {

            if(typeof input == 'string'){
                return input

            }else{
                return $filter('number')(input, 0).replace(",","") ;
            }
            
        };
    }
]);

app.filter('loanDate', ['$filter',
    function($filter) {
        return function(input) {
            return $filter('date')(input, 'MM/dd/yyyy') ;
        };
    }
]);



app.filter('loanCurrency', ['$filter',
    function($filter) {
        return function(input) {
            return $filter('currency')(input, '$', 0) ;
        };
    }
]);

app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});


    app.filter('picker', function($filter) {
  return function(value, filterName) {
    return $filter(filterName)(value);
  };
});