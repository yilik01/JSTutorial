function personController($scope) {
    $scope.person = {
        firstName: "John",
        lastName: "Doe",
        fullName: function() {
        	var x;
        	x = $scope.person;
        	return x.firstName + " " + x.lastName;
        }
    };
    
    $scope.fullName = function(){
    	var x;
    	x = $scope.person;
    	return x.firstName + " " + x.lastName;
    };
	
	$scope.myVar = true;
	
	$scope.toggle = function() {
	    $scope.myVar = !$scope.myVar;
	};
};


function namesController($scope) {
    $scope.names = [
        {name:'Jani',country:'Norway'},
        {name:'Hege',country:'Sweden'},
        {name:'Kai',country:'Denmark'}
    ];
};


function costController($scope) {
    $scope.quantity = 1;
    $scope.price = 9.99;
};


function myController($scope) {
    $scope.count = 0;
};


function myCtrl($scope) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";	
};


function myNoteCtrl($scope){
	$scope.message = "";
    $scope.left  = function() {return 100 - $scope.message.length;};
    $scope.clear = function() {$scope.message = "";};
    $scope.save  = function() {$scope.message = "";};	
};