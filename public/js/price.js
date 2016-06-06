app.service('price', function() {
    "use strict";
    var self = this;

    self.price = function($scope) {

      

        angular.forEach($scope.loans, function(v, k) {
            $scope.loans[k]['nameCheck'] = $scope.loans[k].Program.toString().toLowerCase()
            $scope.loans[k]['loanAge'] = [];
            $scope.loans[k]['Date'] = [];
            $scope.loans[k]['dateLookup'] = [];
            $scope.loans[k]['Borrower Age'] = [];
            var tempDate = new Date($scope.loans[k]['Security Settle']);
            for (var h = 0; h < $scope.admin['Modeled Months']; h++) {
                if (h == 0) {
                    $scope.loans[k]['loanAge'].push(Math.floor(self.days360_new($scope.loans[k]['Funded Date'], $scope.loans[k]['Security Settle']) / 30))
                    $scope.loans[k]['Date'].push(tempDate)
                    $scope.loans[k]['Borrower Age'].push(Math.round(self.getAge($scope.loans[k]['Youngest DOB'], tempDate) * 12) / 12)
                    $scope.loans[k]['dateLookup'].push(tempDate.getMonth() + 1 + "_" + tempDate.getFullYear())
                } else {


                    var tmp = new Date(tempDate).setMonth(tempDate.getMonth() + h)
                   
                    var tmpq = new Date(tmp);
                    tmpq.setDate(20)
                    $scope.loans[k]['loanAge'].push($scope.loans[k]['loanAge'][h - 1] + 1)
                    $scope.loans[k]['Date'].push(tmpq);
                    $scope.loans[k]['dateLookup'].push(tmpq.getMonth() + 1 + "_" + tmpq.getFullYear());
                    $scope.loans[k]['Borrower Age'].push(Math.round(self.getAge($scope.loans[k]['Youngest DOB'], tmpq) * 12) / 12)
                }
            }
        })

        self.paymentLengthCorrection($scope)
        self.LESACorrection($scope);
        self.performanceA($scope);
        self.performanceB($scope);
        self.stateLESA($scope);
        self.collateral($scope);
        self.securityCollateralA($scope);
        self.WAL($scope)
        self.performanceC($scope)
        self.securityCollateralB($scope);



       
         var exportCSV = []
         angular.forEach($scope.loans, function(x,y){
            var temp = {};
           
           temp.loan=x['Loan Number'];
           temp.price=x['Price'];
           temp.WAL=x['Weighted Average Life'];

         

            exportCSV.push(temp)

         })


         var csvArr = Baby.unparse(exportCSV);


           /*self.export(csvArr)*/

    
     

    };



    self.paymentLengthCorrection = function($scope){
          angular.forEach($scope.loans, function(a, b) {
            if(a['Payment Plan'].toString().toLowerCase().includes('tenure')){

                a['Term Length (Mos)'] = 9999
            }

          })
    }

    self.LESACorrection = function($scope) {
        angular.forEach($scope.loans, function(a, b) {
            if ($scope.admin['Tie to Intex?']) {
                a['LESA'] = Math.min(a['LESA'] / 1, a['First Year Monthly Payment'] / 1)
            }
        })

    }

    self.stateLESA = function($scope) {
        angular.forEach($scope.loans, function(a, b) {
            var state = a['State'].toString().trim(),
                index = -1;
            if (state.length > 2) {
                for (var i = 0, len = $scope.lesa.length; i < len; i++) {
                    if ($scope.lesa[i].State.toString().toLowerCase() == state.toLowerCase()) {
                        index = i;
                        break;
                    }
                }
            } else {
                for (var i = 0, len = $scope.lesa.length; i < len; i++) {
                    if ($scope.lesa[i].Abbreviation.toString().toLowerCase() == state.toLowerCase()) {
                        index = i;
                        break;
                    }
                }

            }

            a['LESA index'] = index;
            a['Payment Count'] = $scope.lesa[index]['Payment Count']
            a['First install due'] = $scope.lesa[index]['First install due']
            a['Second install due'] = $scope.lesa[index]['Second install due']
            a['Third install due'] = $scope.lesa[index]['Third install due']
            a['Fourth install due'] = $scope.lesa[index]['Fourth install due']

        })

    }

    self.WAL = function($scope) {
        angular.forEach($scope.loans, function(v, k) {
            $scope.loans[k]['WAL'] = {};
            $scope.loans[k]['WAL']['WAL Calc'] = [];
            $scope.loans[k]['WAL']['HMBS Princ Pay DOwn'] = [];

            var sumProduct = 0,
                sum = 0;
            for (var kk = 0; kk < $scope.admin['Modeled Months']; kk++) {
                var WALCalc,
                    payDown;
                if (kk == 0) {
                    WALCalc = 0;
                    payDown = Math.max($scope.loans[k]['securityCollateral']['Prepays'][kk] + $scope.loans[k]['securityCollateral']['98% Buyouts'][kk] -
                        $scope.loans[k]['securityCollateral']['Int Accrual'][kk], 0)

                } else {

                    WALCalc = self.days360_new($scope.loans[k]['Date'][0], $scope.loans[k]['Date'][kk])
                    payDown = Math.max($scope.loans[k]['securityCollateral']['Prepays'][kk] + $scope.loans[k]['securityCollateral']['98% Buyouts'][kk] -
                        $scope.loans[k]['securityCollateral']['Int Accrual'][kk], 0)
                }

                sumProduct += WALCalc / 1 * payDown / 1;
                sum += payDown / 1

                $scope.loans[k]['WAL']['WAL Calc'].push(WALCalc);
                $scope.loans[k]['WAL']['HMBS Princ Pay DOwn'].push(payDown);
            }

            $scope.loans[k]['Weighted Average Life'] = sumProduct / sum / 360




        })

    }

    self.securityCollateralA = function($scope) {
        angular.forEach($scope.loans, function(v, k) {
            $scope.loans[k]['securityCollateral'] = {};
            $scope.loans[k]['securityCollateral']['Security Balance'] = [];
            $scope.loans[k]['securityCollateral']['Int Accrual'] = [];
            $scope.loans[k]['securityCollateral']['Prepays'] = [];
            $scope.loans[k]['securityCollateral']['98% Buyouts'] = [];
            $scope.loans[k]['securityCollateral']['HMBS CFs'] = [];
            $scope.loans[k]['securityCollateral']['Ending Balance'] = [];

            for (var kk = 0; kk < $scope.admin['Modeled Months']; kk++) {
                var securityBalance,
                    intAccruel,
                    prepays,
                    prebuyouts,
                    buyouts,
                    hmbscf,
                    endingBalance;

                if (kk == 0) {
                    securityBalance = $scope.loans[k]['Beginning Balance'][0]
                    intAccruel = 0;
                    prepays = 0;

                    prebuyouts = ($scope.loans[k]['Beginning Balance'][kk] + $scope.loans[k]['Total Advance'][kk] + $scope.loans[k]['MonthlyServiceFee'][kk] +
                        $scope.loans[k]['Interest Accrual'][kk] + $scope.loans[k]['MonthlyPayment'][kk] -
                        (1 - Math.pow((1 - $scope.loans[k]['HMBS Prepay Vector'][kk] - $scope.loans[k]['Partial Prepay Vector'][kk]), 1 / 12)) *
                        ($scope.loans[k]['Interest Accrual'][kk] + $scope.loans[k]['Beginning Balance'][kk])) / $scope.loans[k]['BOP MCA'][kk] > .98 ? securityBalance + intAccruel + prepays : 0;

                    buyouts = $scope.loans[k]['BOP MCA'][kk] == 0 ? 0 : prebuyouts;
                    hmbscf = 0;
                    endingBalance = securityBalance + intAccruel - prepays - buyouts;



                } else {
                    securityBalance = $scope.loans[k]['securityCollateral']['Ending Balance'][kk - 1]
                    intAccruel = ($scope.loans[k]['Index Value'][kk]/ 12 + $scope.loans[k]['Rate / Margin']/12 - $scope.loans[k]['Servicing Strip']/12)  *
                        securityBalance
                    prepays = $scope.loans[k]['Buyouts'][kk] < 0 ? 0 : (securityBalance + intAccruel) *
                        (1 - Math.pow((1 - $scope.loans[k]['HMBS Prepay Vector'][kk] - $scope.loans[k]['Partial Prepay Vector'][kk]), 1/12))

                    prebuyouts = ($scope.loans[k]['Beginning Balance'][kk] + $scope.loans[k]['Total Advance'][kk] + $scope.loans[k]['MonthlyServiceFee'][kk] +
                        $scope.loans[k]['Interest Accrual'][kk] + $scope.loans[k]['MonthlyPayment'][kk] -
                        (1 - Math.pow((1 - $scope.loans[k]['HMBS Prepay Vector'][kk] - $scope.loans[k]['Partial Prepay Vector'][kk]), 1 / 12)) *
                        ($scope.loans[k]['Interest Accrual'][kk] + $scope.loans[k]['Beginning Balance'][kk])) / $scope.loans[k]['BOP MCA'][kk] > .98 ? securityBalance + intAccruel + prepays : 0;

                


                    buyouts = $scope.loans[k]['BOP MCA'][kk] == 0 ? 0 : prebuyouts;
                    hmbscf = prepays + buyouts;
                    endingBalance = securityBalance + intAccruel - prepays - buyouts;
                }

                $scope.loans[k]['securityCollateral']['Security Balance'].push(securityBalance);
                $scope.loans[k]['securityCollateral']['Int Accrual'].push(intAccruel);
                $scope.loans[k]['securityCollateral']['Prepays'].push(prepays);
                $scope.loans[k]['securityCollateral']['98% Buyouts'].push(buyouts)
                $scope.loans[k]['securityCollateral']['HMBS CFs'].push(hmbscf)
                $scope.loans[k]['securityCollateral']['Ending Balance'].push(endingBalance)




            }



        })

    }

    self.securityCollateralB = function($scope){
            angular.forEach($scope.loans, function(v, k) {

                $scope.loans[k]['securityCollateral']['CF PV']=[] 
               var price = 0;
               
         
              $scope.loans[k]['Interest Owed'] = ($scope.loans[k]['Security Settle'].getDate() - 1) * $scope.loans[k]['UPB'] *
               ($scope.loans[k]['Current Rate'] - $scope.loans[k]['Servicing Strip']) / 360



                for (var kk = 0; kk < $scope.admin['Modeled Months']; kk++) {
                        var cf;

                        cf =$scope.loans[k]['securityCollateral']['HMBS CFs'][kk] /$scope.loans[k]['DF'][kk];
                        price += cf    
                         $scope.loans[k]['securityCollateral']['CF PV'].push(cf)

                }

                price -= $scope.loans[k]['Interest Owed'] ;
                $scope.loans[k]['Price']  = price / $scope.loans[k]['UPB'] 


            })


    }

    self.performanceA = function($scope) {
        angular.forEach($scope.loans, function(v, k) {
            $scope.loans[k]['Swap Curve'] = [];
            $scope.loans[k]['Index Value'] = [];
            $scope.loans[k]['Reset Date'] = new Date($scope.loans[k]['Funded Date'])
            if ($scope.loans[k]['nameCheck'].includes('ann') || $scope.loans[k]['nameCheck'].includes('yea')) {
                $scope.loans[k]['Reset Date'].setDate(1)
                $scope.loans[k]['Reset Date'].setYear($scope.loans[k]['Reset Date'].getFullYear() + 1)
                 $scope.loans[k]['Reset Date'].setMonth($scope.loans[k]['Reset Date'].getMonth() + 1)
            } else if ($scope.loans[k]['nameCheck'].includes('fix')) {
                $scope.loans[k]['Reset Date'].setDate(1)
                $scope.loans[k]['Reset Date'].setYear($scope.loans[k]['Reset Date'].getFullYear() + 100)
            } else {
                if ($scope.admin['Tie to Intex?']) {
                    $scope.loans[k]['Reset Date'].setDate($scope.loans[k]['Reset Date'].getDate() + 60)
                } else {
                    $scope.loans[k]['Reset Date'].setDate($scope.loans[k]['Reset Date'].getDate() + 90)
                }

            }
            //for loop starts here
            for (var h = 0; h < $scope.admin['Modeled Months']; h++) {
                if (h == 0) {
                    var aa = $scope.curves.Lookup.indexOf($scope.loans[k]['dateLookup'][0]);
                    //see if annual 
                    if ($scope.loans[k]['nameCheck'].includes('ann') || $scope.loans[k]['nameCheck'].includes('yea')) {
                        $scope.loans[k]['Swap Curve'].push($scope.curves[$scope.admin['Annual Curve']][aa]);
                        $scope.loans[k]['Index Value'].push($scope.loans[k]['Current Rate'] - $scope.loans[k]['Rate / Margin']);
                    } else if ($scope.loans[k]['nameCheck'].includes('fix')) {
                        $scope.loans[k]['Swap Curve'].push(0);
                        $scope.loans[k]['Index Value'].push(0);
                    } else {
                        $scope.loans[k]['Swap Curve'].push($scope.curves[$scope.admin['Monthly Curve']][aa])
                        $scope.loans[k]['Index Value'].push($scope.loans[k]['Current Rate'] - $scope.loans[k]['Rate / Margin']);

                    }
                    //end time zero below
                } else {
                    var aa = $scope.curves.Lookup.indexOf($scope.loans[k]['dateLookup'][h]);

                    if ($scope.loans[k]['nameCheck'].includes('ann') || $scope.loans[k]['nameCheck'].includes('yea')) {
                        var justInCase = $scope.curves[$scope.admin['Annual Curve']][aa]

                        if (!justInCase) {
                            $scope.loans[k]['Swap Curve'].push($scope.loans[k]['Swap Curve'][h - 1])
                            $scope.loans[k]['Index Value'].push($scope.loans[k]['Index Value'][h - 1])
                        } else {
                            //swap curve done for annual
                            $scope.loans[k]['Swap Curve'].push(justInCase)
                            if ($scope.loans[k]['Date'][h] > $scope.loans[k]['Reset Date']) {

                                ///
                                if ($scope.loans[k]['Date'][h].getMonth() == $scope.loans[k]['Reset Date'].getMonth() +1) {

                           

                                    if ($scope.curves[$scope.admin['Annual Curve']][aa - 1] >= $scope.admin['Annual Curve'][Math.max(aa - 13, 0)]) {
                                        var tempRate = Math.min($scope.curves[$scope.admin['Annual Curve']][aa - 1], $scope.loans[k]['Lifetime Cap'] / 1,
                                            $scope.loans[k]['Index Value'][Math.max(aa - 13, 0)] / 1 + $scope.loans[k]['Annual Cap'] / 1)
                                        $scope.loans[k]['Index Value'].push(tempRate)
                                    } else {
                                        var tempRate = Math.max($scope.curves[$scope.admin['Annual Curve']][aa - 1],
                                            $scope.loans[k]['Initial Rate'] / 1 - $scope.loans[k]['Lifetime Cap'] / 1 + $scope.loans[k]['Initial Rate'] / 1,
                                            $scope.loans[k]['Index Value'][Math.max(aa - 13, 0)] / 1 - $scope.loans[k]['Annual Cap'] / 1)
                                        $scope.loans[k]['Index Value'].push(tempRate)
                                    }

                                } else {
                                    $scope.loans[k]['Index Value'].push($scope.loans[k]['Index Value'][h - 1])
                                }
                                // if greater than reset date
                            } 

                            else {
                                $scope.loans[k]['Index Value'].push($scope.loans[k]['Index Value'][h - 1])
                            }
                        }
                        // end of annual
                    } else if ($scope.loans[k]['nameCheck'].includes('fix')) {
                        $scope.loans[k]['Swap Curve'].push(0)
                        $scope.loans[k]['Index Value'].push(0)
                    } else {
                        var justInCase = $scope.curves[$scope.admin['Monthly Curve']][aa]
                        if (!justInCase) {
                            $scope.loans[k]['Swap Curve'].push($scope.loans[k]['Swap Curve'][h - 1])
                            $scope.loans[k]['Index Value'].push($scope.loans[k]['Index Value'][h - 1])
                        } else {
                            $scope.loans[k]['Swap Curve'].push(justInCase)
                            if ($scope.loans[k]['Date'][h - 1] > $scope.loans[k]['Reset Date']) {
                                if ($scope.curves[$scope.admin['Monthly Curve']][aa - 1] >= $scope.admin['Monthly Curve'][Math.max(aa - 13, 0)]) {
                                    var tempRate = Math.min($scope.curves[$scope.admin['Monthly Curve']][aa - 1], $scope.loans[k]['Lifetime Cap'] / 1, $scope.loans[k]['Index Value'][Math.max(aa - 13, 0)] / 1 + $scope.loans[k]['Annual Cap'] / 1)
                                    $scope.loans[k]['Index Value'].push(tempRate)
                                } else {
                                    var tempRate = Math.max($scope.curves[$scope.admin['Monthly Curve']][aa - 1], $scope.loans[k]['Initial Rate'] / 1 -
                                        $scope.loans[k]['Lifetime Cap'] / 1 + $scope.loans[k]['Initial Rate'] / 1, $scope.loans[k]['Index Value'][Math.max(aa - 13, 0)] / 1 - $scope.loans[k]['Annual Cap'] / 1)
                                    $scope.loans[k]['Index Value'].push(tempRate)
                                }
                            } else {
                                $scope.loans[k]['Index Value'].push($scope.loans[k]['Index Value'][h - 1])
                            }
                        }
                    }
                }
                //end loop below
            }
        })
        //end of performance below
    }

    self.performanceB = function($scope) {
        angular.forEach($scope.loans, function(v, k) {

            $scope.loans[k]['HMBS Prepay Vector'] = [];
            $scope.loans[k]['Partial Prepay Vector'] = [];
            $scope.loans[k]['Draw Rate Used'] = [];
            $scope.loans[k]['BOP loan factor'] = [];
            $scope.loans[k]['BOP MCA'] = [];


            //if intex only go by curve  * tuner else switch to 100% and borrower age limit
            for (var h = 0; h < $scope.admin['Modeled Months']; h++) {
                var prepay,
                    partialPrepay,
                    BOPLoanFactor,
                    draw;

                if (!$scope.admin['Use Partial Prepay']) {
                    partialPrepay = 0;
                } else {
                    partialprepay = $scope.curves[$scope.admin['Partial Prepay']][$scope.loans[k]['loanAge'][h]-1] * $scope.admin['Prepay Tuner']
                }

                if (!$scope.curves[$scope.admin['Prepay']][$scope.loans[k]['loanAge'][h]-1] && $scope.curves[$scope.admin['Prepay']][$scope.loans[k]['loanAge'][h]-1] !== 0) {
                   

                    prepay = $scope.loans[k]['HMBS Prepay Vector'][h - 1];
                } else {
                    if ($scope.admin['Tie to Intex?']) {
                        prepay = $scope.curves[$scope.admin['Prepay']][$scope.loans[k]['loanAge'][h]-1] * $scope.admin['Prepay Tuner']
                    } else {
                        if ($scope.loans[k]['Borrower Age'][h] > $scope.admin['Max Borrower Age']) {
                            prepay = 1;
                        } else {
                            prepay = $scope.curves[$scope.admin['Prepay']][$scope.loans[k]['loanAge'][h]-1] * $scope.admin['Prepay Tuner']
                        }
                    }

                }


                if (h == 0) {
                    $scope.loans[k]['BOP loan factor'].push(1 / 1);
                } else {

                    $scope.loans[k]['BOP loan factor'].push(Math.pow(1 - prepay / 1, 1 / 12) * $scope.loans[k]['BOP loan factor'][h - 1]);
                }

                if (!$scope.curves[$scope.admin['Draw']][$scope.loans[k]['loanAge'][h]] && $scope.curves[$scope.admin['Draw']][$scope.loans[k]['loanAge'][h]] !==0) {
                    draw = $scope.loans[k]['Draw Rate Used'][h - 1];
                } else {
                    draw = $scope.curves[$scope.admin['Draw']][Math.max($scope.loans[k]['loanAge'][h] - 1, 0)] * $scope.admin['Draw Tuner']
                }




                $scope.loans[k]['BOP MCA'].push($scope.loans[k]['BOP loan factor'][h] * $scope.loans[k]['MCA'])
                $scope.loans[k]['HMBS Prepay Vector'].push(prepay)
                $scope.loans[k]['Partial Prepay Vector'].push(partialPrepay)
                $scope.loans[k]['Draw Rate Used'].push(draw);
            }
        })

    }

    self.performanceC = function($scope) {

        angular.forEach($scope.loans, function(v, k) {

            $scope.loans[k]['Discount Rate'] = [];
            $scope.loans[k]['DF'] = [];
            $scope.loans[k]['1/DF'] = [];
            var fixedDRa,
                fixedDRb,
                fixedDRc,
                fixedDRd,
                fixedDRe,
                fixedDR;

            fixedDRa = $scope.curves['Fixed swap Rate'][$scope.curves['Period'].indexOf(Math.ceil($scope.loans[k]['Weighted Average Life']))] -
                $scope.curves['Fixed swap Rate'][$scope.curves['Period'].indexOf(Math.floor($scope.loans[k]['Weighted Average Life']))]


            fixedDRb = $scope.loans[k]['Weighted Average Life'] - Math.floor($scope.loans[k]['Weighted Average Life'])

            fixedDRc =  fixedDRa * fixedDRb

            fixedDRd = $scope.curves['Fixed swap Rate'][$scope.curves['Period'].indexOf(Math.floor($scope.loans[k]['Weighted Average Life']))];
            
            fixedDRe = ($scope.loans[k]['Spread'] + fixedDRa * fixedDRb + fixedDRd)/2+1
            fixedDR = (Math.pow(fixedDRe , 1/6)-1) * 12;
             
                  


            for (var kk = 0; kk < $scope.admin['Modeled Months']; kk++) {
                var disRate,
                    DF,
                    DFdivide;

                if (kk == 0) {

                    if ($scope.loans[k]['nameCheck'].includes('ann') || $scope.loans[k]['nameCheck'].includes('yea')) {

                        disRate = $scope.admin['Tape Spread'] ?  $scope.loans[k]['Spread'] + $scope.loans[k]['Swap Curve'][kk] :
                            $scope.admin['Annual Spread'] + $scope.loans[k]['Swap Curve'][kk];




                    } else if ($scope.loans[k]['nameCheck'].includes('fix')) {

                        disRate = fixedDR;

                    } else {
                        disRate = $scope.admin['Tape Spread'] ? $scope.loans[k]['Spread'] + $scope.loans[k]['Swap Curve'][kk] :
                           $scope.admin['Monthly Spread'] + $scope.loans[k]['Swap Curve'][kk];


                    }

                    DF = 1;
                    DFdivide = 1 / DF;


                } else {


                    if ($scope.loans[k]['nameCheck'].includes('ann') || $scope.loans[k]['nameCheck'].includes('yea')) {

                        disRate = $scope.admin['Tape Spread'] ? $scope.loans[k]['Spread'] + $scope.loans[k]['Swap Curve'][kk] :
                           $scope.admin['Annual Spread'] + $scope.loans[k]['Swap Curve'][kk];


                    } else if ($scope.loans[k]['nameCheck'].includes('fix')) {

                        disRate = fixedDR;

                    } else {
                        disRate = $scope.admin['Tape Spread'] ? $scope.loans[k]['Spread']+ $scope.loans[k]['Swap Curve'][kk] :
                            $scope.admin['Monthly Spread'] + $scope.loans[k]['Swap Curve'][kk];

                    }

                
                

                    DF = (1 + (disRate / 360 * self.days360_new($scope.loans[k]['Date'][kk - 1], $scope.loans[k]['Date'][kk]))) * $scope.loans[k]['DF'][kk - 1]
                    DFdivide = 1 / DF;
                }


            $scope.loans[k]['Discount Rate'].push(disRate)
            $scope.loans[k]['DF'].push(DF)
            $scope.loans[k]['1/DF'].push(DFdivide)



            }


        })


    }

    self.collateral = function($scope) {
        angular.forEach($scope.loans, function(v, k) {
            $scope.loans[k]['Starting PL'] = [];
            $scope.loans[k]['Disbursement Limit'] = [];
            $scope.loans[k]['LESA Balance'] = [];
            $scope.loans[k]['RepairSetAside'] = [];
            $scope.loans[k]['NetPL'] = [];
            $scope.loans[k]['ServiceFeeSetAside'] = [];
            $scope.loans[k]['Available LOC'] = [];
            $scope.loans[k]['Ending PL'] = [];
            $scope.loans[k]['Beginning Balance'] = [];
            $scope.loans[k]['Total Advance'] = [];
            $scope.loans[k]['MonthlyServiceFee'] = [];
            $scope.loans[k]['LESA Advance'] = [];
            $scope.loans[k]['Repair SA Advance'] = [];
            $scope.loans[k]['MonthlyPayment'] = [];
            $scope.loans[k]['Draws'] = [];
            $scope.loans[k]['Prepays'] = [];
            $scope.loans[k]['Buyouts'] = [];

            $scope.loans[k]['Interest Accrual'] = [];
            $scope.loans[k]['Ending Balance'] = [];
            $scope.loans[k]['PLU'] = [];

            for (var kk = 0; kk < $scope.admin['Modeled Months']; kk++) {
                var tempPL,
                    LESABalance,
                    disbursementLimit,
                    repairSetAside,
                    netPL,
                    ServFeeSetAside,
                    AvailableLOC,
                    beginningBalance,
                    totalAdvance,
                    monthlyServiceFee,
                    LESAAdvance,
                    repairSAAdvance,
                    monthlyPayment,
                    draws,
                    prepays,
                    interestAccruel,
                    buyouts,
                    endingBalance;

                if (kk == 0) {
                    $scope.loans[k]['Starting PL'].push($scope.loans[k]['Principal Limit'] / 1);
                    $scope.loans[k]['LESA Balance'].push($scope.loans[k]['LESA']);
                    $scope.loans[k]['Ending PL'].push($scope.loans[k]['Principal Limit'] / 1);
                    beginningBalance = $scope.loans[k]['UPB'] / 1
                    $scope.loans[k]['Beginning Balance'].push(beginningBalance);
                    netPL = $scope.loans[k]['Net PL'];
                    $scope.loans[k]['NetPL'].push(netPL)
                    ServFeeSetAside = $scope.loans[k]['Service Fee Set Aside'];
                    $scope.loans[k]['ServiceFeeSetAside'].push(ServFeeSetAside);



                    totalAdvance = 0;
                    $scope.loans[k]['Total Advance'].push(totalAdvance);

                    monthlyServiceFee = 0;
                    $scope.loans[k]['MonthlyServiceFee'].push(monthlyServiceFee);


                    LESAAdvance = 0;
                    $scope.loans[k]['LESA Advance'].push(LESAAdvance);

                    repairSAAdvance = 0;
                    $scope.loans[k]['Repair SA Advance'].push(repairSAAdvance);

                    monthlyPayment = 0;
                    $scope.loans[k]['MonthlyPayment'].push(monthlyPayment);
                    draws = 0;
                    $scope.loans[k]['Draws'].push(draws);

                    prepays = 0;
                    $scope.loans[k]['Prepays'].push(prepays);

                    interestAccruel = 0;
                    $scope.loans[k]['Interest Accrual'].push(interestAccruel)

                    disbursementLimit = $scope.loans[k]['loanAge'][0] < 12 ? $scope.loans[k]['First Year Remaining LOC'] : $scope.loans[k]['Starting PL'][0];
                    $scope.loans[k]['Disbursement Limit'].push(disbursementLimit);

                    repairSetAside = $scope.loans[k]['Repair Set Aside']

                    $scope.loans[k]['RepairSetAside'].push(repairSetAside);


                    var buyOutNotZero = (($scope.loans[k]['Beginning Balance'][kk] + $scope.loans[k]['Total Advance'][kk] + $scope.loans[k]['MonthlyServiceFee'][kk] + $scope.loans[k]['Interest Accrual'][kk] +
                                $scope.loans[k]['MonthlyPayment'][kk]) - (1 - Math.pow((1 - $scope.loans[k]['HMBS Prepay Vector'][kk] - $scope.loans[k]['Partial Prepay Vector'][kk]), 1 / 12)) *
                            ($scope.loans[k]['Interest Accrual'][kk] + $scope.loans[k]['Beginning Balance'][kk])) / $scope.loans[k]['BOP MCA'][kk] >= .98 ? -1 *
                        ($scope.loans[k]['Beginning Balance'][kk] + $scope.loans[k]['Total Advance'][kk] + $scope.loans[k]['MonthlyServiceFee'][kk] + $scope.loans[k]['MonthlyPayment'][kk] + $scope.loans[k]['Interest Accrual'][kk] + $scope.loans[k]['Prepays'][kk]) : 0;


                    buyouts = $scope.loans[k]['BOP MCA'][kk] <= 0 ? 0 : buyOutNotZero;

                    $scope.loans[k]['Buyouts'].push(buyouts)

                    endingBalance = beginningBalance + monthlyServiceFee + LESAAdvance + repairSAAdvance + monthlyPayment + draws + prepays + buyouts + interestAccruel < .01 ? 0 :
                        beginningBalance + monthlyServiceFee + LESAAdvance + repairSAAdvance + monthlyPayment + draws + prepays + buyouts + interestAccruel;

                    $scope.loans[k]['Ending Balance'].push(endingBalance)

              
                    var availableLOCCOmparison = new Date($scope.loans[k]['Funded Date'])
                    availableLOCCOmparison.setDate(availableLOCCOmparison.getDate() + 355)
                    var tempadj = $scope.loans[k]['Date'][kk] < availableLOCCOmparison? $scope.loans[k]['Disbursement Limit'][kk] :
                        $scope.loans[k]['NetPL'][kk];

                    AvailableLOC = $scope.loans[k]['Program'].toString().toLowerCase().includes('fix') ? 0 : tempadj;
                    $scope.loans[k]['Available LOC'].push(AvailableLOC)


                } else {

                    // 1
                    beginningBalance = $scope.loans[k]['Ending Balance'][kk - 1];

                    $scope.loans[k]['Beginning Balance'].push(beginningBalance);

                    // 2


                    ServFeeSetAside = ($scope.loans[k]['ServiceFeeSetAside'][kk - 1] *
                        (1 + ($scope.loans[k]['Index Value'][kk] / 1 + $scope.loans[k]['Rate / Margin'] / 1 + $scope.admin['Annual MIP'] / 1) / 12)) -
                        (1 - Math.pow((1 - $scope.loans[k]['HMBS Prepay Vector'][kk]), 1 / 12)) *
                        ($scope.loans[k]['ServiceFeeSetAside'][kk - 1] - $scope.loans[k]['MonthlyServiceFee'][kk - 1]) -
                        $scope.loans[k]['MonthlyServiceFee'][kk - 1];

                    $scope.loans[k]['ServiceFeeSetAside'].push(ServFeeSetAside);




                    // 3




                    var repairTemp = $scope.admin['Tie to Intex?'] ? (1 + ($scope.loans[k]['Index Value'][kk] / 1 + $scope.loans[k]['Rate / Margin'] / 1 +
                        $scope.admin['Annual MIP'] / 1) / 12) : 1;


                    repairSetAside = ($scope.loans[k]['RepairSetAside'][kk - 1] /1 * repairTemp) - (1 - Math.pow((1 - $scope.loans[k]['HMBS Prepay Vector'][kk - 1] / 1), 1 / 12)) *
                        ($scope.loans[k]['RepairSetAside'][kk - 1] / 1 - $scope.loans[k]['Repair SA Advance'][kk - 1] / 1) - $scope.loans[k]['Repair SA Advance'][kk - 1] / 1;

                    $scope.loans[k]['RepairSetAside'].push(repairSetAside);

              

                

                    // 4



                       LESABalance =  ($scope.loans[k]['LESA Balance'][kk - 1] * 
                        (1+($scope.loans[k]['Index Value'][kk] / 1 + $scope.loans[k]['Rate / Margin'] / 1 + $scope.admin['Annual MIP'] / 1 )/12)) - 
                       (1 - Math.pow(1 - $scope.loans[k]['HMBS Prepay Vector'][kk - 1] / 1 , 1/12) )  * 
                        ($scope.loans[k]['LESA Balance'][kk - 1] - $scope.loans[k]['LESA Advance'][kk - 1]) - $scope.loans[k]['LESA Advance'][kk - 1]



                    $scope.loans[k]['LESA Balance'].push(LESABalance);

                

                    // 5
                    var endingPL = $scope.loans[k]['Beginning Balance'][kk] < .0001 ? 0 : $scope.loans[k]['Ending PL'][kk - 1];

                    $scope.loans[k]['Starting PL'].push(endingPL)

                    //6


                    var tempEndingPL = $scope.loans[k]['Starting PL'][kk] / 1 * (1 + ($scope.loans[k]['Index Value'][kk] / 1 + $scope.loans[k]['Rate / Margin'] / 1 +
                        $scope.admin['Annual MIP'] / 1) / 12) * Math.pow((1 - $scope.loans[k]['HMBS Prepay Vector'][kk] / 1), 1 / 12);

                    $scope.loans[k]['Ending PL'].push(tempEndingPL);

                    //7



                    monthlyServiceFee = $scope.loans[k]['Ending Balance'][kk - 1] < .01 ? 0 :
                        Math.min($scope.loans[k]['ServiceFeeSetAside'][kk], $scope.loans[k]['Monthly Service Fee'] * $scope.loans[k]['BOP loan factor'][kk - 1]);
                    $scope.loans[k]['MonthlyServiceFee'].push(monthlyServiceFee);

                    //8

                    //9

                    var monthlyPaymentGreaterTwelve,
                        monthlyPaymentother;
                      
                    monthlyPaymentGreaterTwelve = kk <= $scope.loans[k]['Term Length (Mos)'] ?
                     $scope.loans[k]['Monthly Payment'] * $scope.loans[k]['BOP loan factor'][kk - 1] : 0;
                    monthlyPaymentother = $scope.loans[k]['loanAge'][kk] <= 12 ?
                     $scope.loans[k]['First Year Monthly Payment'] * $scope.loans[k]['BOP loan factor'][kk - 1] : monthlyPaymentGreaterTwelve;
                    monthlyPayment = $scope.loans[k]['Ending Balance'][kk - 1] < .01 ? 0 : monthlyPaymentother;

                    $scope.loans[k]['MonthlyPayment'].push(monthlyPayment);

                    //10

                    var preLESAAdvance,
                        ifIntexLESAdvance,
                        minLESAAdvance,
                        ifFullLESA,
                        LESAMult,
                        fullLESA,
                        partialLESA,
                        firstPartial,
                        secondPartial,
                        ifLESABalanceZero ;

                    //Need Talk calculation    





                    LESAMult = ((10 * $scope.loans[k]['LESA Balance'][0] * ($scope.loans[k]['Expected Rate'] / 1 + $scope.admin['Annual MIP'] / 1) / 12 *
                            Math.pow((1 + ($scope.loans[k]['Expected Rate'] / 1 + $scope.admin['Annual MIP'] / 1) / 12), ($scope.talc[Math.floor($scope.loans[0]['Borrower Age'][0])] * 12))
                        ) / (Math.pow((1 + ($scope.loans[k]['Expected Rate'] / 1 + $scope.admin['Annual MIP'] / 1) / 12), (1 + ($scope.talc[Math.floor($scope.loans[0]['Borrower Age'][0])] * 12)))) -
                        (1 + ($scope.loans[k]['Expected Rate'] / 1 + $scope.admin['Annual MIP'] / 1) / 12)) / $scope.loans[k]['Payment Count'] *
                        $scope.loans[k]['BOP loan factor'][kk];


                    fullLESA = $scope.loans[k]['Date'][kk].getMonth() + 1 == $scope.loans[k]['First install due'] || $scope.loans[k]['Date'][kk].getMonth() + 1 == $scope.loans[k]['Second install due'] ||
                        $scope.loans[k]['Date'][kk].getMonth() + 1 == $scope.loans[k]['Third install due'] || $scope.loans[k]['Date'][kk].getMonth() + 1 == $scope.loans[k]['Fourth install due'] ?
                        1 : 0;

                    secondPartial = $scope.loans[k]['Funded Date'].getMonth() + 1;
                    firstPartial = $scope.loans[k]['Funded Date'].getMonth() + 1 > 6 ? $scope.loans[k]['Funded Date'].getMonth() - 5 : $scope.loans[k]['Funded Date'].getMonth() + 7;

                    partialLESA = $scope.loans[k]['Date'][kk].getMonth() + 1 == secondPartial || $scope.loans[k]['Date'][kk].getMonth() + 1 == firstPartial ? 1 : 0;

                    ifFullLESA = $scope.loans[k]['LESA Type'].toString().trim().toLowerCase() == "full" ? fullLESA : partialLESA;

                    minLESAAdvance = Math.min($scope.loans[k]['LESA Balance'][kk] / 1, ifFullLESA * LESAMult)

                    //wierd thing that has to be done due to if then for intex

                    if ($scope.admin['Tie to Intex?']) {

                        totalAdvance = 
                        Math.max(0, Math.min($scope.loans[k]['Draw Rate Used'][kk] * $scope.loans[k]['BOP MCA'][kk - 1], $scope.loans[k]['Available LOC'][kk - 1])) 


                        $scope.loans[k]['Total Advance'].push(totalAdvance);


                    }

                    ifLESABalanceZero = $scope.loans[k]['LESA Balance'][kk]  < .01 ? 0 :$scope.loans[k]['Total Advance'][kk] * $scope.loans[k]['LESA Balance'][kk]  / ($scope.loans[k]['LESA Balance'][kk] / 1 +
                        $scope.loans[k]['RepairSetAside'][kk] / 1 + $scope.loans[k]['Available LOC'][kk - 1] / 1);


                    ifIntexLESAdvance = $scope.admin['Tie to Intex?'] ?  ifLESABalanceZero : minLESAAdvance;


                    LESAAdvance = $scope.loans[k]['LESA Balance'][kk] + $scope.loans[k]['RepairSetAside'][kk] + $scope.loans[k]['Available LOC'][kk - 1] < .01 ? 0 : ifIntexLESAdvance;
                   
                   
                    $scope.loans[k]['LESA Advance'].push(LESAAdvance);



                    //11
                    // probably whee issues lie

                    var repairSAAdvance,
                        repairSAIntex,
                        repairSAIntexNo,
                        RepairSAAd;
                    RepairSAAd = $scope.loans[k]['RepairSetAside'] / (1 - $scope.admin['Repair Set Aside Limit (Mos)'] - $scope.loans[k]['loanAge'][0])
                    repairSAIntex = $scope.loans[k]['Total Advance'][kk] * $scope.loans[k]['RepairSetAside'][kk] / ($scope.loans[k]['LESA Balance'][kk] + $scope.loans[k]['RepairSetAside'][kk] + $scope.loans[k]['Available LOC'][kk - 1])
                    repairSAIntexNo = $scope.loans[k]['loanAge'][kk] <= $scope.admin['Repair Set Aside Limit (Mos)'] ? $scope.loans[k]['BOP loan factor'][kk - 1] * RepairSAAd : 0;
                    


                    repairSAAdvance = $scope.admin['Tie to Intex?'] ? repairSAIntex : repairSAIntexNo;


                    repairSAAdvance = $scope.loans[k]['LESA Balance'][kk] + $scope.loans[k]['RepairSetAside'][kk] + $scope.loans[k]['Available LOC'][kk - 1] < .01 ? 0 : repairSAAdvance;

                    $scope.loans[k]['Repair SA Advance'].push(repairSAAdvance);


                    //12

                    if (!$scope.admin['Tie to Intex?']) {
                       
                        totalAdvance = $scope.admin['Tie to Intex?'] ? Math.max(0, Math.min($scope.loans[k]['Draw Rate Used'][kk] * $scope.loans[k]['BOP MCA'][kk - 1], $scope.loans[k]['Available LOC'][kk - 1])) :
                            $scope.loans[k]['LESA Advance'][kk] + $scope.loans[k]['Repair SA Advance'][kk] + $scope.loans[k]['Draws'][kk];

                        $scope.loans[k]['Total Advance'].push(totalAdvance);



                    }




                    //13


                    var basedonMCA = $scope.admin['Draw Curve Basis'].toString().toLowerCase() == "mca" ? $scope.loans[k]['BOP MCA'][kk - 1] / 1 * $scope.loans[k]['Draw Rate Used'][kk] : $scope.loans[k]['Available LOC'][kk - 1] / 1 *
                        $scope.loans[k]['Draw Rate Used'][kk] / 1;

                    var  preDraw = Math.max(0, Math.min(basedonMCA, $scope.loans[k]['Available LOC'][kk - 1] / 1))

                    draws = $scope.admin['Tie to Intex?'] ? 
                    $scope.loans[k]['Total Advance'][kk] - $scope.loans[k]['LESA Advance'][kk] - $scope.loans[k]['Repair SA Advance'][kk] : preDraw;
                    $scope.loans[k]['Draws'].push(draws)


                    //14


                    interestAccruel = ($scope.loans[k]['Beginning Balance'][kk] / 1 + $scope.loans[k]['Total Advance'][kk] + $scope.loans[k]['MonthlyServiceFee'][kk] + $scope.loans[k]['MonthlyPayment'][kk]) *
                        ($scope.loans[k]['Index Value'][kk] + $scope.loans[k]['Rate / Margin'] / 1 + $scope.admin['Annual MIP'] / 1) / 12
                    $scope.loans[k]['Interest Accrual'].push(interestAccruel)

                    //15






                    prepays = (1 - Math.pow((1 - $scope.loans[k]['HMBS Prepay Vector'][kk] - $scope.loans[k]['Partial Prepay Vector'][kk]), 1 / 12)) * -1 *
                        ($scope.loans[k]['Beginning Balance'][kk] + $scope.loans[k]['Interest Accrual'][kk] + $scope.loans[k]['Total Advance'][kk] +
                        $scope.loans[k]['MonthlyServiceFee'][kk] + $scope.loans[k]['MonthlyPayment'][kk])
                    $scope.loans[k]['Prepays'].push(prepays)




                    //16


                    var buyOutNotZero = (($scope.loans[k]['Beginning Balance'][kk] + $scope.loans[k]['Total Advance'][kk] + $scope.loans[k]['MonthlyServiceFee'][kk] + $scope.loans[k]['Interest Accrual'][kk] +
                                $scope.loans[k]['MonthlyPayment'][kk]) - (1 - Math.pow((1 - $scope.loans[k]['HMBS Prepay Vector'][kk] - $scope.loans[k]['Partial Prepay Vector'][kk]), 1 / 12)) *
                            ($scope.loans[k]['Interest Accrual'][kk] + $scope.loans[k]['Beginning Balance'][kk])) / $scope.loans[k]['BOP MCA'][kk] >= .98 ? -1 *
                        ($scope.loans[k]['Beginning Balance'][kk] + $scope.loans[k]['Total Advance'][kk] + $scope.loans[k]['MonthlyServiceFee'][kk] +
                            $scope.loans[k]['MonthlyPayment'][kk] + $scope.loans[k]['Interest Accrual'][kk] + $scope.loans[k]['Prepays'][kk]) : 0;


                    buyouts = $scope.loans[k]['BOP MCA'][kk] <= 0 ? 0 : buyOutNotZero;

                    $scope.loans[k]['Buyouts'].push(buyouts)

                    //17

                    endingBalance = beginningBalance + monthlyServiceFee + LESAAdvance + repairSAAdvance + monthlyPayment + draws + prepays + buyouts + interestAccruel < .01 ? 0 :
                        beginningBalance + monthlyServiceFee + LESAAdvance + repairSAAdvance + monthlyPayment + draws + prepays + buyouts + interestAccruel;


                    $scope.loans[k]['Ending Balance'].push(endingBalance)


                    //18

                    netPL = $scope.loans[k]['Buyouts'][kk - 1] / 1 < 0 ? 0 : ($scope.loans[k]['NetPL'][kk - 1] / 1 - $scope.loans[k]['Total Advance'][kk] / 1) *
                        (1 + ($scope.loans[k]['Index Value'][kk] / 1 + $scope.loans[k]['Rate / Margin'] / 1 + $scope.admin['Annual MIP'] / 1) / 12) *
                        Math.pow((1 - $scope.loans[k]['HMBS Prepay Vector'][kk]), 1/12);
                    $scope.loans[k]['NetPL'].push(netPL);


                    //19
                 
                    var disbursmentComparison = new Date($scope.loans[k]['Funded Date'])
                    disbursmentComparison.setDate(disbursmentComparison.getDate() + 385)

                    disbursementLimit = $scope.loans[k]['Date'][kk] < disbursmentComparison ? $scope.loans[k]['Disbursement Limit'][kk-1] -
                    (1 - Math.pow((1 - $scope.loans[k]['HMBS Prepay Vector'][kk-1] / 1), 1 / 12)) *
                        ($scope.loans[k]['Disbursement Limit'][kk - 1] - $scope.loans[k]['Total Advance'][kk]) - $scope.loans[k]['Total Advance'][kk] 
                        : $scope.loans[k]['Starting PL'][kk];
                    $scope.loans[k]['Disbursement Limit'].push(disbursementLimit);

               
                

                    //20
                 
                    var availablceLOCComparison = new Date($scope.loans[k]['Funded Date'])
                    availablceLOCComparison.setDate(availablceLOCComparison.getDate() + 355)

                    var tempadj = $scope.loans[k]['Date'][kk] < availablceLOCComparison ? $scope.loans[k]['Disbursement Limit'][kk] :
                        $scope.loans[k]['NetPL'][kk];

                    AvailableLOC = $scope.loans[k]['Program'].toString().toLowerCase().includes('fix') ? 0 : tempadj;
                    $scope.loans[k]['Available LOC'].push(AvailableLOC)



                }


                //end for loop

            }





        })




    }




   self.export = function(arr) {
        //arr is array with headers as [0]

        window.URL = window.webkitURL || window.URL;

        var contentType = 'text/csv';

        var csvFile = new Blob([arr], {
            type: contentType
        });

        var a = document.createElement('a');
        a.download = 'my.csv';
        a.href = window.URL.createObjectURL(csvFile);
        a.textContent = 'Download CSV';

        a.dataset.downloadurl = [contentType, a.download, a.href].join(':');
        a.click()

    }



// place function here

self.days360_new =function(dtStart, dtEnd) {
        var diff = [
        dtEnd.getFullYear() - dtStart.getFullYear(),
        dtEnd.getMonth() - dtStart.getMonth(),
        dtEnd.getDate() - dtStart.getDate(),
        dtEnd.getHours() - dtStart.getHours(),
        dtEnd.getMinutes() - dtStart.getMinutes(),
        dtEnd.getSeconds() - dtStart.getSeconds()
    ];
    var delta = [12, 31, 24, 60, 60];
    delta[1] = (new Date(dtEnd.getFullYear(), dtEnd.getMonth(), 0)).getDate();

    for (var i = diff.length - 1; i > -1; i--) {
        if (diff[i] < 0) {
            if (i > -1) {
                var j = i - 1;
                diff[i] += delta[j];
                diff[j]--;
            } else {
                alert('Negative year difference: ' + diff[0]);
            }
        }
    }
    return diff[0] * 360 + diff[1] * 30 + diff[2];
}


self.getAge = function (d1, d2) {
    d2 = d2 || new Date();
    var diff = d2.getTime() - d1.getTime();
    return (diff / (1000 * 60 * 60 * 24 * 365));
}




});






