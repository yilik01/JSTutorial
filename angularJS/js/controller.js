app.controller("personController", function($scope) {
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
});


app.controller("namesController", function($scope) {
    $scope.names = [
        {name:'Jani',country:'Norway'},
        {name:'Hege',country:'Sweden'},
        {name:'Kai',country:'Denmark'}
    ];
});


app.controller("costController", function($scope) {
    $scope.quantity = 1;
    $scope.price = 9.99;
});


app.controller("myController", function($scope) {
    $scope.count = 0;
});


app.controller("myCtrl", function($scope) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";	
});


app.controller("myNoteCtrl", function($scope){
	$scope.message = "";
    $scope.left  = function() {return 100 - $scope.message.length;};
    $scope.clear = function() {$scope.message = "";};
    $scope.save  = function() {$scope.message = "";};	
});