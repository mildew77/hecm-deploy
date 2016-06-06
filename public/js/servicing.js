app.service('servicing', function() {
    "use strict";
    var self = this;



self.servicing = function($scope) {


self.HMSRComponentsFuturePools($scope)
self.lossAnalysis($scope)
self.cashFLows($scope)
self.NPVservicing($scope)

}

self.NPVservicing = function($scope){
	angular.forEach($scope.loans, function(a, k) {
		a.NPVservicing = {}
		a.NPVservicingCustom = {}

		a.lifeTimeServicingValue = 0;
		a.customServicingValue = 0;
		a.servicingStripValue= 0;

		a.NPVservicing.initialSecuritizationStrip = 0;
		a.NPVservicing.servStripPremium = 0;
		a.NPVservicing.premiumMIPservStrip = 0;
		a.NPVservicing.premiumGFee = 0;
		a.NPVservicing.subDraws = 0;
		a.NPVservicing.LESAadvance = 0;
		a.NPVservicing.RepairSA =0;
		a.NPVservicing.RepairSAAdmin = 0;
		a.NPVservicing.subServStrip = 0;
		a.NPVservicing.premiumOnSubStrip =0;
		a.NPVservicing.MIPsubs = 0;
		a.NPVservicing.GFeeSubs = 0;
		a.NPVservicing.monthlyServ = 0;
		a.NPVservicing.premServFee  = 0;
		a.NPVservicing.cashReserveReq = 0;
		a.NPVservicing.subServFee = 0;
		a.NPVservicing.propLosses = 0;
		a.NPVservicing.interestShortfall = 0;

		a.NPVservicingCustom.initialSecuritizationStrip = 0;
		a.NPVservicingCustom.servStripPremium = 0;
		a.NPVservicingCustom.premiumMIPservStrip = 0;
		a.NPVservicingCustom.premiumGFee = 0;
		a.NPVservicingCustom.subDraws = 0;
		a.NPVservicingCustom.LESAadvance = 0;
		a.NPVservicingCustom.RepairSA =0;
		a.NPVservicingCustom.RepairSAAdmin = 0;
		a.NPVservicingCustom.subServStrip = 0;
		a.NPVservicingCustom.premiumOnSubStrip =0;
		a.NPVservicingCustom.MIPsubs = 0;
		a.NPVservicingCustom.GFeeSubs = 0;
		a.NPVservicingCustom.monthlyServ = 0;
		a.NPVservicingCustom.premServFee  = 0;
		a.NPVservicingCustom.cashReserveReq = 0;
		a.NPVservicingCustom.subServFee = 0;
		a.NPVservicingCustom.propLosses = 0;
		a.NPVservicingCustom.interestShortfall = 0;

for (var kk = 0; kk < $scope.admin['Modeled Months']; kk++) {

		a.NPVservicing.initialSecuritizationStrip += a.servicing.initialSecuritizationStrip[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1);
		a.NPVservicing.servStripPremium += a.servicing.servStripPremium[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1);
		a.NPVservicing.premiumMIPservStrip += a.servicing.premiumMIPservStrip[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1);  
		a.NPVservicing.premiumGFee += a.servicing.premiumGFee[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1); 
		a.NPVservicing.subDraws += a.servicing.subDraws[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1);  
		a.NPVservicing.LESAadvance += a.servicing.LESAadvance[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1);  
		a.NPVservicing.RepairSA += a.servicing.RepairSA[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1 ); 
		a.NPVservicing.RepairSAAdmin += a.servicing.RepairSAAdmin[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1);
		a.NPVservicing.subServStrip += a.servicing.subServStrip[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1);
		a.NPVservicing.premiumOnSubStrip +=a.servicing.premiumOnSubStrip[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1); 
		a.NPVservicing.MIPsubs += a.servicing.MIPsubs[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1);  
		a.NPVservicing.GFeeSubs += a.servicing.GFeeSubs[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1);  
		a.NPVservicing.monthlyServ += a.servicing.monthlyServ[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1) ;  
		a.NPVservicing.premServFee  += a.servicing.premServFee[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1);  
		a.NPVservicing.cashReserveReq += a.servicing.cashReserveReq[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1); 
		a.NPVservicing.subServFee += a.servicing.subServFee[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1);  
		a.NPVservicing.propLosses += a.servicing.propLosses[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1);  
		a.NPVservicing.interestShortfall += a.servicing.interestShortfall[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk  +1);  
 
  
 	 if(kk < $scope.admin['MSR Age']){
		
		a.NPVservicingCustom.initialSecuritizationStrip += a.servicing.initialSecuritizationStrip[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1);
		a.NPVservicingCustom.servStripPremium += a.servicing.servStripPremium[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1);
		a.NPVservicingCustom.premiumMIPservStrip += a.servicing.premiumMIPservStrip[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1);  
		a.NPVservicingCustom.premiumGFee += a.servicing.premiumGFee[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1); 
		a.NPVservicingCustom.subDraws += a.servicing.subDraws[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1);  
		a.NPVservicingCustom.LESAadvance += a.servicing.LESAadvance[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1);  
		a.NPVservicingCustom.RepairSA += a.servicing.RepairSA[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1); 
		a.NPVservicingCustom.RepairSAAdmin += a.servicing.RepairSAAdmin[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1);
		a.NPVservicingCustom.subServStrip += a.servicing.subServStrip[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1);
		a.NPVservicingCustom.premiumOnSubStrip +=a.servicing.premiumOnSubStrip[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1); 
		a.NPVservicingCustom.MIPsubs += a.servicing.MIPsubs[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1);  
		a.NPVservicingCustom.GFeeSubs += a.servicing.GFeeSubs[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1);  
		a.NPVservicingCustom.monthlyServ += a.servicing.monthlyServ[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1);  
		a.NPVservicingCustom.premServFee  += a.servicing.premServFee[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1);  
		a.NPVservicingCustom.cashReserveReq += a.servicing.cashReserveReq[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1); 
		a.NPVservicingCustom.subServFee += a.servicing.subServFee[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1);  
		a.NPVservicingCustom.propLosses += a.servicing.propLosses[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1);  
		a.NPVservicingCustom.interestShortfall += a.servicing.interestShortfall[kk]/Math.pow(1 + $scope.admin['Discount Rate']/12 ,kk +1);  

 	 } 

}

 	 angular.forEach(a.NPVservicing, function(x,y){ 	 	 		 	
 	 	a.lifeTimeServicingValue += x/1;
 	 })

 	  angular.forEach(a.NPVservicingCustom, function(x,y){ 	 	 		 	
 	 	a.customServicingValue += x/1;
 	 })

 	 a.lifeTimeServicingValue = a.lifeTimeServicingValue/a['UPB'];
 	 a.customServicingValue = a.customServicingValue/a['UPB'];
 	 a.servicingStripValue = a.NPVservicing.initialSecuritizationStrip/a['UPB'];

	})

}

self.lossAnalysis = function($scope){
	angular.forEach($scope.loans, function(a, k) {
		a.lossAnaylysis = {};
		a.lossAnaylysis['Home Value'] = [];
		a.lossAnaylysis['LTV'] = [];
		a.lossAnaylysis['Payoffs'] = [];
		a.lossAnaylysis['Delinquent'] = [];
		a.lossAnaylysis['Sale Based Claims'] = [];
		a.lossAnaylysis['Appraisal Based Claims'] = [];
		a.lossAnaylysis['Sale Based Claim Losses'] = [];
		a.lossAnaylysis['Appraisal Based Claim Losses'] = [];
		a.lossAnaylysis['Total Property Losses'] = [];

for (var kk = 0; kk < $scope.admin['Modeled Months']; kk++) {

	if(kk==0){
		a.lossAnaylysis['Home Value'].push(a['Appraised Value'])
		a.lossAnaylysis['LTV'] .push(a.lossAnaylysis['Home Value'][kk]==0?0: a['Ending Balance'][kk]/a.lossAnaylysis['Home Value'][kk])
		a.lossAnaylysis['Payoffs'].push(-1 * a['Prepays'][kk] - a['Buyouts'][kk] )
		a.lossAnaylysis['Delinquent'].push($scope.curves['Percent Delinquent'][closest (a.lossAnaylysis['LTV'][kk], $scope.curves['LTV'])] * a.lossAnaylysis['Payoffs'][kk])
		a.lossAnaylysis['Sale Based Claims'].push(kk < $scope.admin['Sale Based Claim Timeline (Mos)'] ? 0 : a.lossAnaylysis['Delinquent'][Math.max(0,kk - $scope.admin['Sale Based Claim Timeline (Mos)'])] * $scope.admin['Sale Based Claim Probability'])
		
		

		a.lossAnaylysis['Appraisal Based Claims'].push(kk < $scope.admin['Appraisal Based Claim Timeline (Mos)'] ? 0 : a.lossAnaylysis['Delinquent'][Math.max(0,kk - $scope.admin['Appraisal Based Claim Timeline (Mos)'])] * $scope.admin['Appraisal Based Claim Probability']) 
		
		a.lossAnaylysis['Sale Based Claim Losses'].push(a.lossAnaylysis['Sale Based Claims'][kk] * $scope.admin['Sale Based Claim Loss Severity'] ) 
		a.lossAnaylysis['Appraisal Based Claim Losses'].push(a.lossAnaylysis['Appraisal Based Claims'][kk] * $scope.admin['Appraisal Based Claim Loss Severity'] ) 
		a.lossAnaylysis['Total Property Losses'].push(a.lossAnaylysis['Sale Based Claim Losses'][kk] + a.lossAnaylysis['Appraisal Based Claim Losses'][kk] )

	}else{

		a.lossAnaylysis['Home Value'].push((a.lossAnaylysis['Home Value'][kk -1] *( 1 + $scope.admin['Annual HPA']/12 ) ) * Math.pow(1-a['HMBS Prepay Vector'][kk],1/12))

		a.lossAnaylysis['LTV'] .push(a.lossAnaylysis['Home Value'][kk]==0?0: a['Ending Balance'][kk]/a.lossAnaylysis['Home Value'][kk])
		a.lossAnaylysis['Payoffs'].push(-1 * a['Prepays'][kk] - a['Buyouts'][kk] )
		a.lossAnaylysis['Delinquent'].push($scope.curves['Percent Delinquent'][closest (a.lossAnaylysis['LTV'][kk], $scope.curves['LTV'])] * a.lossAnaylysis['Payoffs'][kk])
		a.lossAnaylysis['Sale Based Claims'].push(kk < $scope.admin['Sale Based Claim Timeline (Mos)'] ? 0 : a.lossAnaylysis['Delinquent'][Math.max(0,kk - $scope.admin['Appraisal Based Claim Timeline (Mos)'])] * $scope.admin['Sale Based Claim Probability'])
			

		a.lossAnaylysis['Appraisal Based Claims'].push(kk < $scope.admin['Appraisal Based Claim Timeline (Mos)'] ? 0 : a.lossAnaylysis['Delinquent'][Math.max(0,kk - $scope.admin['Appraisal Based Claim Timeline (Mos)'])] * $scope.admin['Appraisal Based Claim Probability'])
		a.lossAnaylysis['Sale Based Claim Losses'].push(a.lossAnaylysis['Sale Based Claims'][kk] * $scope.admin['Sale Based Claim Loss Severity'] ) 
		a.lossAnaylysis['Appraisal Based Claim Losses'].push(a.lossAnaylysis['Appraisal Based Claims'][kk] * $scope.admin['Appraisal Based Claim Loss Severity'] ) 
		a.lossAnaylysis['Total Property Losses'].push(a.lossAnaylysis['Sale Based Claim Losses'][kk] + a.lossAnaylysis['Appraisal Based Claim Losses'][kk] )

	}
	
}




	})


}

self.cashFLows = function($scope){
 angular.forEach($scope.loans, function(a, k) {

 	a.servicing = {};
 	a.servicing.initialSecuritizationStrip = [];
 	a.servicing.servStripPremium = [];
 	a.servicing.premiumMIPservStrip = [];
 	a.servicing.premiumGFee = [];
 	a.servicing.subDraws = [];
 	a.servicing.LESAadvance = [];
 	a.servicing.RepairSA = [];
 	a.servicing.RepairSAAdmin = [];
 	a.servicing.subServStrip = [];
 	a.servicing.premiumOnSubStrip = [];
 	a.servicing.MIPsubs = [];
 	a.servicing.GFeeSubs = [];
 	a.servicing.monthlyServ = [];
 	a.servicing.premServFee = [];
 	a.servicing.cashReserveReq = [];
 	a.servicing.subServFee = [];
 	a.servicing.propLosses = [];
 	a.servicing.interestShortfall = [];
for (var kk = 0; kk < $scope.admin['Modeled Months']; kk++) {
	if(kk==0){
		a.servicing.initialSecuritizationStrip.push(0);
		
		a.servicing.servStripPremium.push(a.servicing.initialSecuritizationStrip[kk] * a.HMSRComponents['SecurityPrice'][kk] - a.servicing.initialSecuritizationStrip[kk]);

		a.servicing.premiumMIPservStrip.push(0);

		a.servicing.premiumGFee.push(0);

		a.servicing.subDraws.push(0);

		a.servicing.LESAadvance.push(0);

		a.servicing.RepairSA.push(0);

		a.servicing.RepairSAAdmin.push(0);

		a.servicing.subServStrip.push(0);

		a.servicing.premiumOnSubStrip.push(0);

		a.servicing.MIPsubs.push(0);

		a.servicing.GFeeSubs.push(0);

		a.servicing.monthlyServ.push(0);

		a.servicing.premServFee.push(0)

		a.servicing.cashReserveReq.push(0);

		a.servicing.subServFee.push($scope.admin['Monthly Servicing Exp'] * -1 * a['BOP loan factor'][kk] )

		a.servicing.propLosses.push(a.lossAnaylysis['Total Property Losses'][kk] * -1)

		

		a.servicing.interestShortfall.push((a['Rate / Margin']/12 + a['Index Value'][kk]/12 - a['Servicing Strip']/12 ) * -1 *
			(a.securityCollateral['Prepays'][kk] + a.securityCollateral['98% Buyouts'][kk] + a.futurePools['Prepays'][kk])/2 )


	}else{
		a.servicing.initialSecuritizationStrip.push(a.securityCollateral['Ending Balance'][kk] < .1 ? 0 : a.securityCollateral['Security Balance'][kk-1] *
		 (a['Servicing Strip'] - $scope.admin['G fee'])/12 );

		a.servicing.servStripPremium.push(a.servicing.initialSecuritizationStrip[kk] * a.HMSRComponents['SecurityPrice'][kk] - a.servicing.initialSecuritizationStrip[kk] )

		a.servicing.premiumMIPservStrip.push(a.securityCollateral['Security Balance'][kk-1] * $scope.admin['Annual MIP']/12 * (a.HMSRComponents['SecurityPrice'][kk] - 1) )
	
		a.servicing.premiumGFee.push(a.securityCollateral['Security Balance'][kk-1] * $scope.admin['G fee']/12 *(a.HMSRComponents['SecurityPrice'][kk] - 1) )

		a.servicing.subDraws.push( a['Draws'][kk-1] * (a.HMSRComponents['SecurityPrice'][kk] - 1))

		a.servicing.LESAadvance.push(a['LESA Advance'][kk-1] * (a.HMSRComponents['SecurityPrice'][kk] - 1))

		a.servicing.RepairSA.push( a['Repair SA Advance'][kk-1]  * (a.HMSRComponents['SecurityPrice'][kk] - 1))

		a.servicing.RepairSAAdmin.push( kk + a['loanAge'][0] -1 <= $scope.admin['Repair Set Aside Limit (Mos)'] ?
			Math.max(50, a['Repair Set Aside'] * .015) / $scope.admin['Repair Set Aside Limit (Mos)'] * a['BOP loan factor'][kk-1]:0)

		a.servicing.subServStrip.push(a.futurePools['SecurityBalance'][kk-1] * (a['Servicing Strip'] - $scope.admin['G fee'])/12)

		a.servicing.premiumOnSubStrip.push(a.servicing.subServStrip[kk] * (a.HMSRComponents['SecurityPrice'][kk] - 1))

		a.servicing.MIPsubs.push(a.futurePools['SecurityBalance'][kk-1]  * $scope.admin['Annual MIP']/12 * (a.HMSRComponents['SecurityPrice'][kk] - 1))

		a.servicing.GFeeSubs.push(a.futurePools['SecurityBalance'][kk-1] * $scope.admin['G fee']/12 * (a.HMSRComponents['SecurityPrice'][kk] - 1) )

		a.servicing.monthlyServ.push(a['MonthlyServiceFee'][kk] );

		a.servicing.premServFee.push(a.servicing.monthlyServ[kk] * (a.HMSRComponents['SecurityPrice'][kk] - 1))

		a.servicing.cashReserveReq.push(a.HMSRComponents['CashReserve'][kk-1] - a.HMSRComponents['CashReserve'][kk]);

		a.servicing.subServFee.push($scope.admin['Monthly Servicing Exp'] * -1 * a['BOP loan factor'][kk] )

		a.servicing.propLosses.push(a.lossAnaylysis['Total Property Losses'][kk] * -1)


		a.servicing.interestShortfall.push((a['Rate / Margin']/12 + a['Index Value'][kk]/12 - a['Servicing Strip']/12 ) * -1 *
			(a.securityCollateral['Prepays'][kk] + a.securityCollateral['98% Buyouts'][kk] + a.futurePools['Prepays'][kk])/2 )

	}

}

 })

}

self.HMSRComponentsFuturePools = function($scope){
   angular.forEach($scope.loans, function(a, k) {
   	a.POMonth =  a['Ending Balance'].indexOf(0)
   	a.HMSRComponents = {};
   	a.futurePools = {};

   	a.HMSRComponents.SecurityPrice = [];
   	a.HMSRComponents.MIP = [];
   	a.HMSRComponents.GFee = [];
   	a.HMSRComponents.TailSecuritization = [];
   	a.HMSRComponents.CashReserve = [];

   	a.futurePools.SecurityBalance =[];
   	a.futurePools.IntAccrual =[];
   	a.futurePools.Prepays=[];
   	a.futurePools.EndingBalance=[];
 for (var kk = 0; kk < $scope.admin['Modeled Months']; kk++) {

if(kk == 0){
a.HMSRComponents.SecurityPrice.push((a.Price - 1) * $scope.admin['Tail Gain Scaler'] + 1 )
a.HMSRComponents.MIP.push(0);
a.HMSRComponents.GFee.push(0);
a.HMSRComponents.TailSecuritization.push(0);
a.HMSRComponents.CashReserve.push(0);
a.futurePools.SecurityBalance.push(0);
a.futurePools.IntAccrual.push(0);
a.futurePools.Prepays.push(0);
a.futurePools.EndingBalance.push(0);

}else{
a.HMSRComponents.SecurityPrice.push((a.HMSRComponents.SecurityPrice[0]-1) * (a.POMonth - kk)/a.POMonth +1)
a.HMSRComponents.MIP.push(a['Ending Balance'][kk] <.01 ? 0 : a['Beginning Balance'][kk] * $scope.admin['Annual MIP']/12)
a.futurePools.SecurityBalance.push(a.HMSRComponents.TailSecuritization[kk-1] + a.futurePools.EndingBalance[kk-1])
a.HMSRComponents.GFee.push(a['Ending Balance'][kk]  < .01 ? 0 : (a.futurePools['SecurityBalance'][kk] + a.securityCollateral['Security Balance'][kk]) * $scope.admin['G fee'] /12 )
a.HMSRComponents.TailSecuritization.push(a['Ending Balance'][kk]  < .01 ? 0 : 
	a['Beginning Balance'][kk] *( a['Servicing Strip'] - $scope.admin['G fee'] )/12
	+ a['Total Advance'][kk] + a['MonthlyServiceFee'][kk] + a['MonthlyPayment'][kk] +
	a.HMSRComponents.MIP[kk] + a.HMSRComponents.GFee[kk] )
a.HMSRComponents.CashReserve.push((a.futurePools.SecurityBalance[kk]  + a.securityCollateral['Security Balance'][kk] ) * $scope.admin['Cash Reserve Requirement'])
a.futurePools.IntAccrual.push((a['Rate / Margin']/12 + a['Index Value'][kk]/12 - a['Servicing Strip']/12)
	* a.futurePools.SecurityBalance[kk])
var prepay = a['Ending Balance'][kk] == 0 ? a.futurePools.SecurityBalance[kk] + a.futurePools.IntAccrual[kk]:
(a.futurePools.SecurityBalance[kk] + a.futurePools.IntAccrual[kk]) * (1-Math.pow(1 - a['HMBS Prepay Vector'][kk] - a['Partial Prepay Vector'][kk] ,1/12))
a.futurePools.Prepays.push(prepay)
a.futurePools.EndingBalance.push(a.futurePools.SecurityBalance[kk] + a.futurePools.IntAccrual[kk] -a.futurePools.Prepays[kk])

}
 }
   })

}





})

  function closest(num, arr) {
                var curr = arr[0];
                var diff = Math.abs (num - curr);
                for (var val = 0; val < arr.length; val++) {
                    var newdiff = Math.abs (num - arr[val]);
                    if (newdiff < diff) {
                        diff = newdiff;
                        curr = val;
                    }
                }
                return curr;
            }