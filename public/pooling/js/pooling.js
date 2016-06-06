app.service('pooling', function() {
    var self = this;


    self.bestEx = function($scope) {
        var population = {};
        population.annualPopulation = [];
        population.monthlyPopulation = [];
        population.fixedPopulation = [];



        angular.forEach($scope.loanInfo.results.rows, function(v, k) {
            var temp = {};

            temp.loan = v['Loan Number'];
            temp.product = v['Program'];
            temp.age = v['Youngest DOB'];
            temp.wam = v['Rate / Margin'];
            temp.purpose = v['Purpose'];
            temp.plu = v['UPB'] / v['Principal Limit'];
            temp.upb = v['UPB'];
            temp.ready = v['Ready to Pool'];

            if (v['Funded Date'] == 'Invalid Date') {
                var myDate = new Date();
                myDate.setFullYear(myDate.getFullYear() + 1);

                temp.funded = myDate;
            } else {
                temp.funded = v['Funded Date'];
            }
            if (v['Ready to Pool']) {
                var nameCheck = temp.product.toString().toLowerCase()
                if (nameCheck.includes('ann') || nameCheck.includes('yea')) {
                    population.annualPopulation.push(temp);
                } else if (nameCheck.includes('fix')) {
                    population.fixedPopulation.push(temp);
                } else {
                    population.monthlyPopulation.push(temp)
                }

            }


        })
        population.annualPopulation.sort(function(a, b) {
            return new Date(a.funded) - new Date(b.funded);
        });
        population.fixedPopulation.sort(function(a, b) {
            return new Date(a.funded) - new Date(b.funded);
        });
        population.monthlyPopulation.sort(function(a, b) {
            return new Date(a.funded) - new Date(b.funded);
        });

        var pooling = {}
        pooling.tradesToFill = [];





        angular.forEach($scope.trades.data, function(v, k) {
            if (v.fill) {
                pooling.tradesToFill.push(v)
            }
        })
        angular.forEach(pooling.tradesToFill, function(v, k) {
            v.balanceWatch = new Number(0);
            if (v.product == "Fixed") {
                v.priceCompare = (v.WAM - .0506) * $scope.buyUpBuyDown * 100 + v.price;

            } else {
                v.priceCompare = (v.WAM - .0275) * $scope.buyUpBuyDown * 100 + v.price;
            }
        })




        var poolingCompare = {};
        poolingCompare.results = {};
        poolingCompare.results.annual = 0;
        poolingCompare.results.fixed = 0;
        poolingCompare.results.monthly = 0;
        poolingCompare.tradesToFill = [];
        var bestExGoing = true;
        var bestExCount = 0;

        while(bestExGoing){
        for (var d = 0; d < 100; d++) {
        	
            ////////////////////////////////		
            ////////////////////////////////////////////////	
            //Where the fun begins  ////////////////////////
            ////////////////////////////////
            ////////////////////////////////	

            self.attempt($scope, population, pooling);
            self.stats(pooling)
            self.compare(pooling, poolingCompare)


            self.adjust(pooling)
            self.stats(pooling)
            self.compare(pooling, poolingCompare)

            self.adjustAgain(pooling)
            self.stats(pooling)
            self.compare(pooling, poolingCompare)

            self.finish(pooling);
            self.stats(pooling)
            self.compare(pooling, poolingCompare)
            self.stats(pooling)
          

            /* self.finish(pooling);
            self.stats(pooling)
            self.compare(pooling, poolingCompare)*/



            ////////////////////////////////		
            ////////////////////////////////////////////////	
            //Where the fun ends    ////////////////////////
            ////////////////////////////////
            ////////////////////////////////	


        }
        	bestExGoing = self.howAreWeDoing(poolingCompare);
        	bestExCount ++;
        	if(bestExCount > 1000){
        		bestExGoing = false
        	}

        	
        	
        	
        	}
        //Cycle through each population Fixed, Annual Monthly and find where pooling compare placed them

        angular.forEach(population, function(a, b) {

            angular.forEach(a, function(d, e) {
                d.pool = "";
                angular.forEach(poolingCompare.tradesToFill, function(f, g) {
                    angular.forEach(f.loans, function(h, i) {

                        if (d.loan == h.loan) {
                            d.pool = f.pool

                        }
                    })
                })
            })
        })


        angular.forEach(population.annualPopulation, function(a, b) {
            a.age = _calculateAge(a.age);

        })

          angular.forEach(population.monthlyPopulation, function(a, b) {
            a.age = _calculateAge(a.age);

        })
           angular.forEach(population.fixedPopulation, function(a, b) {
            a.age = _calculateAge(a.age);

        })

          var hold = [];
           angular.forEach(population.annualPopulation, function(a, b) {
            hold.push(a);
               

        })
            angular.forEach(population.monthlyPopulation, function(a, b) {
           hold.push(a);

        })


          angular.forEach(population.fixedPopulation, function(a, b) {
            hold.push(a);


        })
           


        var csvArr = Baby.unparse(hold);
        self.export(csvArr);

    }

    self.howAreWeDoing = function(poolingCompare){
    	var tradeTotal = poolingCompare.tradesToFill.length * 5;
    	var poolingCount = 0;
    	var going = true;
    	angular.forEach(poolingCompare.results, function(a,b){
    		poolingCount += a;
    	})

    	angular.forEach(poolingCompare.tradesToFill,function(a,b){
    		
    		if(Math.abs(a.balanceWatch/1 - a.UPB/1) < a['UPB Variance']/1 * a.UPB/1){
    			poolingCount += 1;

    			
    		}
    	})
    	console.log(tradeTotal,poolingCount)
    	if(tradeTotal - poolingCount == 0 ){
    		going = false;
    	}
    	return going;
    }

    self.compare = function(pooling, poolingCompare) {

        var goodToGo = true;

        angular.forEach(pooling.tradesToFill, function(a, b) {	

            if (Math.abs(a.balanceWatch - a.UPB)/1 > (a.UPB * a['UPB Variance'])/1 && a.product == "Annual") {
                goodToGo = false;
            }
        })

        if (pooling.results.annual > poolingCompare.results.annual && goodToGo) {
            poolingCompare.results.annual = pooling.results.annual;
            var arrayLength = poolingCompare.tradesToFill.length;
            angular.forEach(poolingCompare.tradesToFill, function(a, b) {
                if (a.product == "Annual") {
                    a.type = 0
                } else {
                    a.type = 1
                }
            })
            poolingCompare.tradesToFill.sort(function(c, d) {
                return c.type - d.type;
            });
            for (var gg = 0; gg < arrayLength; gg++) {
                if (poolingCompare.tradesToFill[0].product == "Annual") {
                    poolingCompare.tradesToFill.shift();
                }
            }

            angular.forEach(pooling.tradesToFill, function(a, b) {
                if (a.product == "Annual") {
                    var tempA = angular.copy(a);
                    poolingCompare.tradesToFill.push(tempA);
                }
            })
        }

        var goodToGo = true;

        angular.forEach(pooling.tradesToFill, function(a, b) {
            if (Math.abs(a.balanceWatch - a.UPB) >= (a.UPB * a['UPB Variance']) && a.product == "Monthly") {
                goodToGo = false;
            }
        })

        if (pooling.results.monthly > poolingCompare.results.monthly && goodToGo) {
            poolingCompare.results.monthly = pooling.results.monthly;

            var arrayLength = poolingCompare.tradesToFill.length;
            angular.forEach(poolingCompare.tradesToFill, function(a, b) {
                if (a.product == "Monthly") {
                    a.type = 0
                } else {
                    a.type = 1
                }
            })
            poolingCompare.tradesToFill.sort(function(c, d) {
                return c.type - d.type;
            });
            for (var gg = 0; gg < arrayLength; gg++) {
                if (poolingCompare.tradesToFill[0].product == "Monthly") {
                    poolingCompare.tradesToFill.shift()
                }
            }
            angular.forEach(pooling.tradesToFill, function(a, b) {
                if (a.product == "Monthly") {
                    var tempA = angular.copy(a);
                    poolingCompare.tradesToFill.push(tempA)
                }
            })
        }

        var goodToGo = true;

        angular.forEach(pooling.tradesToFill, function(a, b) {
            if (Math.abs(a.balanceWatch - a.UPB) >= (a.UPB * a['UPB Variance']) && a.product == "Fixed") {
                goodToGo = false;
            }
        })
        if (pooling.results.fixed > poolingCompare.results.fixed && goodToGo) {
            poolingCompare.results.fixed = pooling.results.fixed;
            var arrayLength = poolingCompare.tradesToFill.length;
            angular.forEach(poolingCompare.tradesToFill, function(a, b) {
                if (a.product == "Fixed") {
                    a.type = 0
                } else {
                    a.type = 1
                }
            })
            poolingCompare.tradesToFill.sort(function(c, d) {
                return c.type - d.type;
            });
            for (var gg = 0; gg < arrayLength; gg++) {
                if (poolingCompare.tradesToFill[0].product == "Fixed") {
                    poolingCompare.tradesToFill.shift()
                }
            }
            angular.forEach(pooling.tradesToFill, function(a, b) {
                if (a.product == "Fixed") {
                    var tempA = angular.copy(a);
                    poolingCompare.tradesToFill.push(tempA)
                }
            })

        }




    }


    self.finish = function(pooling) {

        var loopParameters = [
            ['wam', 'WAM', 'GWAM Variance'],
            ['age', 'age', 'Age Variance'],
            ['plu', 'PLU', 'PLU Variance']
        ]
        angular.forEach(pooling.tradesToFill, function(a, b) {
            a.balanceWatch = 0
            for (var kk = 0; kk < a.loans.length; kk++) {
                a.balanceWatch += a.loans[kk].upb
            }

            if (a.balanceWatch > a.UPB * (1 + a['UPB Variance'])) {
                var sortParameter = "",
                    sortVariance = 0,
                    how = "";
                for (var ii = 0; ii < loopParameters.length; ii++) {
                    if (Math.abs(a.stats[loopParameters[ii][0]] - a[loopParameters[ii][1]]) / a[loopParameters[ii][1]] > sortVariance) {
                        sortVariance = Math.abs(a.stats[loopParameters[ii][0]] - a[loopParameters[ii][1]]) / a[loopParameters[ii][1]];
                        sortParameter = loopParameters[ii][0];
                        if (a.stats[loopParameters[ii][0]] > a[loopParameters[ii][1]]) {
                            how = "highLow";
                        } else {
                            how = "lowHigh"
                        }
                    }
                }
                if (how == "highLow") {
                    a.loans.sort(function(c, d) {
                        return d[sortParameter] - c[sortParameter];
                    });
                } else {
                    a.loans.sort(function(c, d) {
                        return c[sortParameter] - d[sortParameter];
                    });
                }

                var keepGoing = true;
                while (keepGoing) {
                    try {
                        var tmpLoan = a.loans.shift()
                        pooling.residual[a.product].unshift(tmpLoan)
                        a.balanceWatch -= tmpLoan.upb

                        if (a.balanceWatch < a.UPB) {
                            keepGoing = false
                        }
                    } catch (e) {
                        keepGoing = false
                    }


                }


            }

            

            if (a.balanceWatch < a.UPB * (1 - a['UPB Variance'])) {
                var sortParameter = "",
                    sortVariance = 0,
                    how = "";
                for (var ii = 0; ii < loopParameters.length; ii++) {
                    if (Math.abs(a.stats[loopParameters[ii][0]] - a[loopParameters[ii][1]]) / a[loopParameters[ii][1]] > sortVariance) {
                        sortVariance = Math.abs(a.stats[loopParameters[ii][0]] - a[loopParameters[ii][1]]) / a[loopParameters[ii][1]];
                        sortParameter = loopParameters[ii][0];
                        if (a.stats[loopParameters[ii][0]] < a[loopParameters[ii][1]]) {
                            how = "highLow";
                        } else {
                            how = "lowHigh"
                        }
                    }
                }
                if (how == "highLow") {
                    pooling.residual[a.product].sort(function(c, d) {
                        return d[sortParameter] - c[sortParameter];
                    });
                } else {
                    pooling.residual[a.product].sort(function(c, d) {
                        return c[sortParameter] - d[sortParameter];
                    });
                }
                var keepGoing = true;
                while (keepGoing) {
                    try {
                    	self.stats(pooling)
                    	if(how == "highLow" && pooling.residual[a.product][loopParameters[ii][0]] > a[loopParameters[ii][0]]  || how == "lowHigh" && pooling.residual[a.product][loopParameters[ii][0]] < a[loopParameters[ii][0]]){
                    		var tmpLoan = pooling.residual[a.product].shift()
                        a.loans.unshift(tmpLoan)
                        a.balanceWatch += tmpLoan.upb

                    	} 
                    	else{
                    		keepGoing = false;
                    	}


                        

                        if (a.balanceWatch > a.UPB) {
                            keepGoing = false
                        }
                    } catch (e) {
                        keepGoing = false
                    }


                }


            }



        })

    }

    self.adjustAgain = function(pooling) {
        var loopParameters = [
            ['wam', 'WAM', 'GWAM Variance'],
            ['age', 'age', 'Age Variance'],
            ['plu', 'PLU', 'PLU Variance']
        ]

        for (var i = 0; i < loopParameters.length; i++) {

            angular.forEach(pooling.tradesToFill, function(a, b) {
                if (a.scoreCard < 4) {

                    self.stats(pooling);
                    if (Math.abs(a.stats[loopParameters[i][0]] - a[loopParameters[i][1]]) >= a[loopParameters[i][2]]) {
                        if (a.stats[loopParameters[i][0]] > a[loopParameters[i][1]]) {
                            a.loans.sort(function(c, d) {
                                return c[loopParameters[i][0]] - d[loopParameters[i][0]];
                            });
                        } else {
                            a.loans.sort(function(c, d) {
                                return d[loopParameters[i][0]] - c[loopParameters[i][0]];
                            });
                        }

                        var keepGoing = true;
                        while (keepGoing) {
                            try {
                                var tpLoan = a.loans.shift()
                                pooling.residual[a.product].unshift(tpLoan);
                                a.balanceWatch -= tpLoan.upb

                                if (a.balanceWatch + pooling.residual[a.product][0].upb <= a.UPB * .7) {
                                    keepGoing = false;
                                }
                            } catch (e) {
                                keepGoing = false;
                            }
                        }

                    }

                }
            })
            self.stats(pooling);

            angular.forEach(pooling.tradesToFill, function(a, b) {

                if (a.scoreCard < 4) {
                    if (Math.abs(a.stats[loopParameters[i][0]] - a[loopParameters[i][1]]) >= a[loopParameters[i][2]]) {
                        if (a.stats[loopParameters[i][0]] > a[loopParameters[i][1]]) {
                            pooling.residual[a.product].sort(function(c, d) {
                                return c[loopParameters[i][0]] - d[loopParameters[i][0]];
                            });
                        } else {
                            pooling.residual[a.product].sort(function(c, d) {
                                return d[loopParameters[i][0]] - c[loopParameters[i][0]];
                            });
                        }
                        var keepGoing = true;
                        while (keepGoing) {

                            try {
                                var tLoan = pooling.residual[a.product].shift()
                                a.loans.unshift(tLoan);
                                a.balanceWatch += tLoan.upb
                                if (a.balanceWatch + pooling.residual[a.product][0].upb >= a.UPB * 1.2) {
                                    keepGoing = false;
                                }
                            } catch (e) {
                                keepGoing = false;
                            }
                        }

                    }
                }
            })
            self.stats(pooling)

        }


        for (var i = loopParameters.length - 1; i >= 0; i--) {
            angular.forEach(pooling.tradesToFill, function(a, b) {
                if (a.scoreCard < 4) {

                    self.stats(pooling);
                    if (Math.abs(a.stats[loopParameters[i][0]] - a[loopParameters[i][1]]) >= a[loopParameters[i][2]]) {
                        if (a.stats[loopParameters[i][0]] > a[loopParameters[i][1]]) {
                            a.loans.sort(function(c, d) {
                                return c[loopParameters[i][0]] - d[loopParameters[i][0]];
                            });
                        } else {
                            a.loans.sort(function(c, d) {
                                return d[loopParameters[i][0]] - c[loopParameters[i][0]];
                            });
                        }

                        var keepGoing = true;
                        while (keepGoing) {

                            try {
                                var tLloan = a.loans.shift();
                                pooling.residual[a.product].unshift(tLloan);
                                a.balanceWatch -= tLloan.upb
                                if (a.balanceWatch + pooling.residual[a.product][0].upb <= a.UPB * .6) {
                                    keepGoing = false;
                                }
                            } catch (e) {
                                keepGoing = false;
                            }
                        }

                    }
                }
            })
            self.stats(pooling);

            angular.forEach(pooling.tradesToFill, function(a, b) {

                if (a.scoreCard < 4) {
                    if (Math.abs(a.stats[loopParameters[i][0]] - a[loopParameters[i][1]]) >= a[loopParameters[i][2]]) {
                        if (a.stats[loopParameters[i][0]] > a[loopParameters[i][1]]) {
                            pooling.residual[a.product].sort(function(c, d) {
                                return c[loopParameters[i][0]] - d[loopParameters[i][0]];
                            });
                        } else {
                            pooling.residual[a.product].sort(function(c, d) {
                                return d[loopParameters[i][0]] - c[loopParameters[i][0]];
                            });
                        }
                        var keepGoing = true;
                        while (keepGoing) {

                            try {
                                var aLoan = pooling.residual[a.product].shift()
                                a.loans.unshift(aLoan);
                                a.balanceWatch += aLoan.upb
                                if (a.balanceWatch + pooling.residual[a.product][0].upb >= a.UPB * 1.1) {
                                    keepGoing = false;
                                }
                            } catch (e) {
                                keepGoing = false;
                            }
                        }

                    }
                }

            })
            self.stats(pooling)
        }

    }


    self.adjust = function(pooling) {
        angular.forEach(pooling.tradesToFill, function(a, b) {
            if (a.scoreCard < 4) {
                var templength = a.loans.length,
                    sort = "",
                    how = "";
                if (Math.abs(a.stats.wam - a.WAM) >= a['GWAM Variance']) {
                    sort = "wam";
                    if (a.stats.wam > a.WAM) {
                        how = "highLow";
                    } else {
                        how = "lowHigh"
                    }
                }
                if (Math.abs(a.stats.age - a.age) >= a['Age Variance']) {
                    sort = "age";
                    if (a.stats.age > a.age) {
                        how = "highLow";
                    } else {
                        how = "lowHigh"
                    }
                }
                if (Math.abs(a.stats.plu - a.PLU) >= a['PLU Variance']) {
                    sort = "plu";
                    if (a.stats.plu > a.PLU) {
                        how = "highLow";
                    } else {
                        how = "lowHigh"
                    }
                }

                if (how == "highLow") {
                    a.loans.sort(function(c, d) {
                        return d[sort] - c[sort];
                    });
                } else {
                    a.loans.sort(function(c, d) {
                        return c[sort] - d[sort];
                    });
                }
                var goodToKeepGoing = true;
                while (a.balanceWatch > a.UPB * (1 - a['UPB Variance']) && goodToKeepGoing) {

                    if (a.loans.length > 0) {
                        var tempLoan = a.loans.shift();
                        a.balanceWatch -= tempLoan.upb;
                        pooling.residual[a.product].push(tempLoan);
                    } else {
                        goodToKeepGoing = false
                    }
                }

            }
        })

        angular.forEach(pooling.tradesToFill, function(a, b) {
            if (a.scoreCard < 4) {
                var sort = "",
                    how = "";
                if (Math.abs(a.stats.plu - a.PLU) >= a['PLU Variance']) {
                    sort = "plu";
                    if (a.stats.plu > a.PLU) {
                        how = "highLow";
                    } else {
                        how = "lowHigh"
                    }
                }
                if (Math.abs(a.stats.age - a.age) >= a['Age Variance']) {
                    sort = "age";
                    if (a.stats.age > a.age) {
                        how = "highLow";
                    } else {
                        how = "lowHigh"
                    }
                }
                if (Math.abs(a.stats.wam - a.WAM) >= a['GWAM Variance']) {
                    sort = "wam";
                    if (a.stats.wam > a.WAM) {
                        how = "highLow";
                    } else {
                        how = "lowHigh"
                    }
                }
                if (how == "highLow") {
                    pooling.residual[a.product].sort(function(c, d) {
                        return d[sort] - c[sort];
                    });
                } else {
                    pooling.residual[a.product].sort(function(c, d) {
                        return c[sort] - d[sort];
                    });
                }

                var residualLength = pooling.residual[a.product].length,
                    keepOnGoing = true;

                for (var m = 0; m < residualLength; m++) {

                    if (pooling.residual[a.product][m]) {
                        if (pooling.residual[a.product][m].upb + a.balanceWatch >= a.UPB * (1 + a['UPB Variance']) || pooling.residual[a.product].length == 0) {
                            keepOnGoing = false;
                        }
                        if (keepOnGoing) {

                            var tempLoan = pooling.residual[a.product].shift()
                            a.loans.push(tempLoan)
                            a.balanceWatch += tempLoan.upb
                        }
                    }
                }
            }
        })
    }

    self.stats = function(pooling) {

        var stats = {};
        stats.wamProduct = 0;
        stats.ageProduct = 0;
        stats.pluProduct = 0;
        stats.refiSum = 0;
        stats.wam = 0;
        stats.age = 0;
        stats.plu = 0;
        stats.refi = 0;
        pooling.results = {};
        pooling.results.annual = 0;
        pooling.results.fixed = 0;
        pooling.results.monthly = 0;

        angular.forEach(pooling.tradesToFill, function(aa, bbb) {
            aa.stats = {};
            aa.balanceWatch = 0;
            aa.stats.wamProduct = 0;
            aa.stats.ageProduct = 0;
            aa.stats.pluProduct = 0;
            aa.stats.refiSum = 0;
            aa.stats.wam = 0;
            aa.stats.age = 0;
            aa.stats.plu = 0;
            aa.stats.refi = 0;
            aa.scoreCard = 0;

            angular.forEach(aa.loans, function(x, y) {
                aa.balanceWatch += x.upb
                aa.stats.wamProduct += x.wam * x.upb
                aa.stats.ageProduct += _calculateAge(x.age) * x.upb
                aa.stats.pluProduct += x.plu * x.upb
                if (x.purpose == "HECMToHECMRefinance") {
                    aa.stats.refiSum += x.upb
                }

            })
            aa.stats.wam = aa.stats.wamProduct / aa.balanceWatch;
            aa.stats.age = aa.stats.ageProduct / aa.balanceWatch;
            aa.stats.plu = aa.stats.pluProduct / aa.balanceWatch;
            aa.stats.refi = aa.stats.refiSum / aa.balanceWatch;
            if (Math.abs(aa.stats.wam - aa.WAM) < aa['GWAM Variance']) {
                aa.scoreCard += 1
            }
            if (Math.abs(aa.stats.age - aa.age) < aa['Age Variance']) {
                aa.scoreCard += 1
            }
            if (Math.abs(aa.stats.plu - aa.PLU) < aa['PLU Variance']) {
                aa.scoreCard += 1
            }
            if (aa.stats.refi < aa.refi) {
                aa.scoreCard += 1
            }

        })

        angular.forEach(pooling.tradesToFill, function(aa, bb) {
            if (aa.product == "Annual") {
                pooling.results.annual += aa.scoreCard
            }
            if (aa.product == "Monthly") {
                pooling.results.monthly += aa.scoreCard
            }
            if (aa.product == "Fixed") {
                pooling.results.fixed += aa.scoreCard
            }

        });




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

    self.attempt = function($scope, population, pooling) {

        var annual = population.annualPopulation.slice(0),
            monthly = population.monthlyPopulation.slice(0),
            fixed = population.fixedPopulation.slice(0),
            annualCount = 0,
            monthlyCount = 0,
            fixedCount = 0,
            annualTrack = 0,
            monthlyTrack = 0,
            fixedTrack = 0;
        pooling.tradesToFill.sort(function(a, b) {
            return b.priceCompare - a.priceCompare;
        });

        angular.forEach(pooling.tradesToFill, function(a, b) {
            if (a.product == "Annual") {
                a.count = annualCount
                annualCount++;
            } else if (a.product == "Fixed") {
                a.count = fixedCount;
                fixedCount++
            } else {
                a.count = monthlyCount;
                monthlyCount++;
            }
            a.loans = [];
        })
        //annual start
        annualLength = annual.length;
        var annualResidual = [];
        for (var i = 0; i < annualLength; i++) {
            if (annualTrack >= annualCount) {
                annualTrack = 0
            }
            // maybe update this to .85
            var binomial = new Abba.BinomialDistribution(annual.length, Math.random() + .3);
            var result = binomial.inverseCdf(Math.random());
            result = result * 1.1;
            result = Math.floor(Math.min(result, annual.length));
            var tempLoan = annual.splice(result - 1, 1);

            angular.forEach(pooling.tradesToFill, function(a, b) {
                if (a.product == "Annual" && a.count == annualTrack && a.balanceWatch <= ((1 - a['UPB Variance']) * a.UPB)) {
                    a.loans.push(tempLoan[0])
                    a.balanceWatch += tempLoan[0].upb / 1;
                    tempLoan = false;
                }
            })
            annualTrack++;
            if (tempLoan) {
                annualResidual.push(tempLoan[0])
            }
        }



        var annualResidualLength = annualResidual.length;
        var annualResidualResidual = [];
        for (var i = 0; i < annualResidualLength; i++) {
            var binomial = new Abba.BinomialDistribution(annualResidual.length, 0.8);
            var result = binomial.inverseCdf(Math.random());
            result = result * 1.1;
            result = Math.floor(Math.min(result, annualResidual.length));
            var tempLoan = annualResidual.splice(result - 1, 1);
            var keepGoing = true;
            angular.forEach(pooling.tradesToFill, function(a, b) {
                if (keepGoing) {
                    if (a.product == "Annual" && a.balanceWatch + tempLoan[0].upb / 1 < ((1 + a['UPB Variance']) * a.UPB)) {
                        a.loans.push(tempLoan[0])
                        a.balanceWatch += tempLoan[0].upb / 1;
                        keepGoing = false;
                    }
                }
            })
            if (keepGoing) {
                annualResidualResidual.push(tempLoan[0])
            }
        }
        //annual end

        //monthly start
        monthlyLength = monthly.length;
        var monthlyResidual = [];
        for (var i = 0; i < monthlyLength; i++) {
            if (monthlyTrack >= monthlyCount) {
                monthlyTrack = 0
            }
            // maybe update this to .85
            var binomial = new Abba.BinomialDistribution(monthly.length, Math.random() + .3);
            var result = binomial.inverseCdf(Math.random());
            result = result * 1.1;
            result = Math.floor(Math.min(result, monthly.length));
            var tempLoan = monthly.splice(result - 1, 1);

            angular.forEach(pooling.tradesToFill, function(a, b) {
                if (a.product == "Monthly" && a.count == monthlyTrack && a.balanceWatch <= ((1 - a['UPB Variance']) * a.UPB)) {
                    a.loans.push(tempLoan[0])
                    a.balanceWatch += tempLoan[0].upb / 1;
                    tempLoan = false;
                }
            })
            monthlyTrack++;
            if (tempLoan) {
                monthlyResidual.push(tempLoan[0])
            }
        }



        var monthlyResidualLength = monthlyResidual.length;
        var monthlyResidualResidual = [];
        for (var i = 0; i < monthlyResidualLength; i++) {
            var binomial = new Abba.BinomialDistribution(monthlyResidual.length, 0.8);
            var result = binomial.inverseCdf(Math.random());
            result = result * 1.1;
            result = Math.floor(Math.min(result, monthlyResidual.length));
            var tempLoan = monthlyResidual.splice(result - 1, 1);
            var keepGoing = true;
            angular.forEach(pooling.tradesToFill, function(a, b) {
                if (keepGoing) {
                    if (a.product == "Monthly" && a.balanceWatch + tempLoan[0].upb / 1 < ((1 + a['UPB Variance']) * a.UPB)) {
                        a.loans.push(tempLoan[0])
                        a.balanceWatch += tempLoan[0].upb / 1;
                        keepGoing = false;
                    }
                }
            })
            if (keepGoing) {
                monthlyResidualResidual.push(tempLoan[0])
            }
        }
        //monthly end
        //fixed start
        fixedLength = fixed.length;
        var fixedResidual = [];
        for (var i = 0; i < fixedLength; i++) {
            if (fixedTrack >= fixedCount) {
                fixedTrack = 0
            }
            // maybe update this to .85
            var binomial = new Abba.BinomialDistribution(fixed.length, Math.random() + .3);
            var result = binomial.inverseCdf(Math.random());
            result = result * 1.1;
            result = Math.floor(Math.min(result, fixed.length));
            var tempLoan = fixed.splice(result - 1, 1);

            angular.forEach(pooling.tradesToFill, function(a, b) {
                if (a.product == "Fixed" && a.count == fixedTrack && a.balanceWatch <= ((1 - a['UPB Variance']) * a.UPB)) {
                    a.loans.push(tempLoan[0])
                    a.balanceWatch += tempLoan[0].upb / 1;
                    tempLoan = false;
                }
            })
            fixedTrack++;
            if (tempLoan) {
                fixedResidual.push(tempLoan[0])
            }
        }



        var fixedResidualLength = fixedResidual.length;
        var fixedResidualResidual = [];
        for (var i = 0; i < fixedResidualLength; i++) {
            var binomial = new Abba.BinomialDistribution(fixedResidual.length, 0.8);
            var result = binomial.inverseCdf(Math.random());
            result = result * 1.1;
            result = Math.floor(Math.min(result, fixedResidual.length));
            var tempLoan = fixedResidual.splice(result - 1, 1);
            var keepGoing = true;
            angular.forEach(pooling.tradesToFill, function(a, b) {
                if (keepGoing) {
                    if (a.product == "Fixed" && a.balanceWatch + tempLoan[0].upb / 1 < ((1 + a['UPB Variance']) * a.UPB)) {
                        a.loans.push(tempLoan[0])
                        a.balanceWatch += tempLoan[0].upb / 1;
                        keepGoing = false;
                    }
                }
            })
            if (keepGoing) {
                fixedResidualResidual.push(tempLoan[0])
            }
        }
        //fixed end


        pooling.residual = {};
        pooling.residual.Annual = annualResidualResidual.slice(0);
        pooling.residual.Monthly = monthlyResidualResidual.slice(0);
        pooling.residual.Fixed = fixedResidualResidual.slice(0);


    }
    //attempt end


});

function _calculateAge(birthday) { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

var Abba = {};

Abba.NormalDistribution = function(mean, standardDeviation) {
    if (mean === undefined) {
        mean = 0;
    }
    if (standardDeviation === undefined) {
        standardDeviation = 1;
    }
    this.mean = mean;
    this.standardDeviation = standardDeviation;
};
Abba.NormalDistribution.prototype = {
    density: function(value) {
        return jStat.normal.pdf(value, this.mean, this.standardDeviation);
    },

    // Returns P(x < value) for x standard normal. value may be any number.
    cdf: function(value) {
        return jStat.normal.cdf(value, this.mean, this.standardDeviation);
    },

    // Returns P(x > value) for x standard normal. value may be any number.
    survival: function(value) {
        return 1 - this.cdf(value);
    },

    // Returns z such that P(x < z) = probability for x standard normal.
    // probability must be in (0, 1).
    inverseCdf: function(probability) {
        return jStat.normal.inv(probability, this.mean, this.standardDeviation);
    },

    // Returns z such that P(x > z) = probability for x standard normal.
    // probability must be in (0, 1).
    inverseSurvival: function(probability) {
        return this.mean - (this.inverseCdf(probability) - this.mean);
    }
};

Abba.BinomialDistribution = function(numTrials, probability) {
    this.SMALL_SAMPLE_MAX_TRIALS = 100;
    this.numTrials = numTrials;
    this.probability = probability;
    this.expectation = numTrials * probability;
    this.standardDeviation = Math.sqrt(this.expectation * (1 - probability));

    // normal approximation to this binomial distribution
    this._normal = new Abba.NormalDistribution(this.expectation, this.standardDeviation);
    this._lowerTailProbability = this._normal.cdf(-0.5);
    this._upperTailProbability = this._normal.survival(numTrials + 0.5);
};
Abba.BinomialDistribution.prototype = {
    mass: function(count) {
        if (this.numTrials <= this.SMALL_SAMPLE_MAX_TRIALS) {
            return jStat.binomial.pdf(count, this.numTrials, this.probability);
        } else {
            return this._normal.density(count);
        }
    },

    _rescaleProbability: function(probability) {
        return probability / (1 - this._lowerTailProbability - this._upperTailProbability);
    },

    cdf: function(count) {
        if (count < 0) {
            return 0;
        } else if (count >= this.numTrials) {
            return 1;
        } else if (this.numTrials <= this.SMALL_SAMPLE_MAX_TRIALS) {
            return jStat.binomial.cdf(count, this.numTrials, this.probability);
        } else {
            return this._rescaleProbability(
                this._normal.cdf(count + 0.5) - this._lowerTailProbability);
        }
    },

    survival: function(count) {
        return 1 - this.cdf(count);
    },

    inverseCdf: function(probability) {
        return Math.max(0, Math.min(this.numTrials, this._normal.inverseCdf(probability)));
    },

    inverseSurvival: function(probability) {
        return Math.max(0, Math.min(this.numTrials, this._normal.inverseSurvival(probability)));
    }
};