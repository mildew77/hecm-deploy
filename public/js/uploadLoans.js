app.service('uploadLoans', function() {
    this.uploadLoans = function(upload, $scope) {

        $(upload).parse({
            header: true,
            complete: function(results, file, inputElem, event) {
                $scope.loanCount = 0;
                angular.forEach(results.results.rows, function(value, key) {

                    $scope.loanCount++;
                    angular.forEach(value, function(v, k) {

                        if (typeof v == 'string' && v.search("%") > 0) {
                            value[k] = v.replace(/%/i, '') / 100;
                        }
                        if (k == "Funded Date" || k == "Security Settle" || k == "Youngest DOB") {
                            value[k] = new Date(v);
                        }
                        if (k == "Ready to Pool") {
                            if (value[k].toLowerCase() == "false" || value[k].toLowerCase() == "no") {
                                value[k] = false;
                            } else {
                                value[k] = true
                            }

                        }
                        if (k == "MCA" || k == "UPB" || k == "Principal Limit" || k == "Net PL" || k == "Monthly Payment" || k == "Set Aside") {
                            if (typeof v == 'string') {
                                value[k] = parseFloat(v.replace(/,/g, ''))
                            }
                        }

                        if (typeof v == 'string' && v.search('\\$') > 0) {

                            value[k] = Number(v.replace(/[^0-9\.]+/g, ""))
                        }
                        if (typeof v == 'string' && v.search(',') > 0) {

                            value[k] = Number(v.replace(/[^0-9\.]+/g, ""))
                        }
                        if (typeof v == 'string' && v.search('-') > 0) {

                            value[k] = Number(v.replace(/[^0-9\.]+/g, ""))
                        }


                    })


                });

                var i = results.results.rows.length;
                while (i--) {
                    if (!results.results.rows[i]['Loan Number']) {
                        results.results.rows.splice(i, 1);
                        $scope.loanCount--;
                    }
                }


                $scope.loanInfo = {};
                $scope.loanInfo = Object.assign({}, results);

                $scope.loanInfo.fields = [];
                angular.forEach($scope.loanInfo.results.fields, function(a, b) {
                    var tempp = {};
                    tempp.field = a
                    if ($scope.headerInclusion.indexOf(a) > -1) {
                        tempp.include = true;
                    } else {
                        tempp.include = false;
                    }
                    $scope.loanInfo.fields.push(tempp)
                })



                $scope.statsContainer.programs = [];
                $scope.statsContainer.UPB = [];
                $scope.statsContainer.Age = [];
                $scope.statsContainer.SumProductAge = [];
                $scope.statsContainer.Rate = [];
                $scope.statsContainer.SumProductRate = [];
                $scope.statsContainer.PL = [];
                $scope.statsContainer.WeightedPLU = [];
                $scope.statsContainer.Count = [];
                $scope.statsContainer.Pool = [];




                angular.forEach(results.results.rows, function(value, key) {
                    if ($scope.statsContainer.programs.indexOf(value.Program) == -1) {
                        $scope.statsContainer.programs.push(value.Program)
                    }
                })


                for (i = 0; i < $scope.statsContainer.programs.length; i++) {
                    $scope.statsContainer.UPB.push(0);
                    $scope.statsContainer.Age.push(0);
                    $scope.statsContainer.SumProductAge.push(0);
                    $scope.statsContainer.Rate.push(0);
                    $scope.statsContainer.SumProductRate.push(0);
                    $scope.statsContainer.PL.push(0);
                    $scope.statsContainer.Count.push(0);
                    $scope.statsContainer.WeightedPLU.push(0);
                }

                var duplicateLoanNumber = []
                angular.forEach(results.results.rows, function(value, key) {
                    duplicateLoanNumber.push(value['Loan Number'])
                    $scope.statsContainer.UPB[$scope.statsContainer.programs.indexOf(value.Program)] += value['UPB'];
                    $scope.statsContainer.Rate[$scope.statsContainer.programs.indexOf(value.Program)] += value['Rate / Margin'];
                    $scope.statsContainer.SumProductRate[$scope.statsContainer.programs.indexOf(value.Program)] += value['Rate / Margin'] * value['UPB'];
                    $scope.statsContainer.PL[$scope.statsContainer.programs.indexOf(value.Program)] += value['Principal Limit'];
                    $scope.statsContainer.Age[$scope.statsContainer.programs.indexOf(value.Program)] += _calculateAge(value['Youngest DOB']);
                    $scope.statsContainer.SumProductAge[$scope.statsContainer.programs.indexOf(value.Program)] += _calculateAge(value['Youngest DOB']) * value['UPB'];
                    $scope.statsContainer.WeightedPLU[$scope.statsContainer.programs.indexOf(value.Program)] += (value['UPB'] / value['Principal Limit']) * value['UPB'];
                    $scope.statsContainer.Count[$scope.statsContainer.programs.indexOf(value.Program)] += 1;
                })

                var sorted_arr = duplicateLoanNumber.slice().sort();
                var results = [];
                for (var i = 0; i < duplicateLoanNumber.length - 1; i++) {
                    if (sorted_arr[i + 1] == sorted_arr[i]) {
                        results.push(sorted_arr[i]);
                    }
                }
                if (results.length > 0) {
                    alert("Found duplicate loans: " + results);
                }

                angular.forEach($scope.loanInfo.results.rows, function(v, k) {
                    $scope.loans.push(v)
                })

                $scope.inputFileDisplay = file.name;
                $scope.showLoans = true;
                $scope.showStats = true;
                $scope.showUpload = false;
                $scope.loanTable = true;
                $scope.pageLimitUpdate();
                $scope.$apply()


            }
        })



    }
});

function _calculateAge(birthday) { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}