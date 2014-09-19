document.writeln('Hello, World!');

//********************************
// Function Literal
//********************************
//
// 1. reserved word: function
// 2. function's name (optional)
// 3. parameters in ()
// 4. statements in {}
var add = function (a, b) {
	return a+b;	
};

//********************************
// Invocation:
//********************************
//
// Receive two parameters 
// 1. this: value determine by invocation pattern
//    * method invocation pattern
//    * function invocation pattern
//    * constructor invocation pattern
//    * apply invocation pattern
// 2. arguments

//--------------------------------
// 1.1. Method Invocation Pattern
//--------------------------------
//
// A 'method' is when a function is stored as a property of an object
//
var myObject = {
	value: 0,
	increment: function(inc) {
		this.value += typeof inc === 'number' ? inc : 1;
	}
};

myObject.increment();
document.writeln(myObject.value);

myObject.increment(2);
document.writeln(myObject.value);
	
//--------------------------------
// 1.2. Function Invocation Pattern
//--------------------------------
// 
// A 'function' is when a function is not a property of an object.  This is bound to the global object,
// where 'this' is bound to the outer function, instead of the inner function.  Hence, a workaround
// is required.
//
var sum = add(3,4);

myObject.double = function() {
	var that = this; // Workaround
	
	var helper = function() {
		that.value = add(that.value, that.value);
	};
	
	helper();
}

myObject.double();
document.writeln(myObject.value);

//--------------------------------
// 1.3. Constructor Invocation Pattern
//--------------------------------
// 
// When a function is invoked with the 'new' prefix, than a new object will be created with a
// hidden link to the value of the function's prototype member.  
//
var Quo = function(string) {
	this.status = string;
};

Quo.prototype.get_status = function () {
	return this.status;
}

var myQuo = new Quo("confused");
document.writeln(myQuo.get_status());

//--------------------------------
// 1.4. Apply Invocation Pattern
//--------------------------------
//
// The apply method lets us construct an array of arguments to use to invoke a function.  It 
// also lets us choose the value of 'this'.  The 'apply' method takes two parameters:
// 1. the value that should be bound to 'this'
// 2. array of parameters
//
var array = [3,4];
var sum = add.apply(null, array); // sum is 7

var statusObject = {
	status: 'A-OK'
};

var status = Quo.prototype.get_status.apply(statusObject); // status is A-OK

//********************************
// Function Parameters/Statements
//********************************
//--------------------------------
// 2.1 Arguments
//--------------------------------
//
// Argument gives the function access to all of the arguments that were supplied with the invocation,
// including excess arguments that were not assigned to parameters
//
var sum = function() {
	var i, sum = 0; // variable 'sum' inside of function does not interfere with the 'sum' defined outside
	for (i = 0; i < arguments.length; i += 1) {
		sum += arguments[i];
	}
	return sum;
};

document.writeln(sum(4,8,15,16,23,42));

//--------------------------------
// 2.2 Return
//--------------------------------
//
// * If return value is not specified, 'undefined' is returned.
// * If the function was invoked with the 'new' prefix, and the return value is not an object, then 'this' 
//   (the new object) is returned instead.
//


//--------------------------------
// 2.3 Exceptions
//--------------------------------
var add = function(a, b) {
	if (typeof a !== 'number' || typeof b !== 'number') {
		throw {
			name: 'TypeError',
			message: 'add needs numbers'
		}
	}
	
	return a + b;
}

var try_it = function() {
	try {
		add("seven");
	}
	catch (e) {
		document.writeln(e.name +  ': ' + e.message);
	}
}

try_it();

//********************************
// Coding concept
//********************************
//
//--------------------------------
// 3.1 Augmenting Types
//--------------------------------
// Using the Function.prototype to make a method available to all functions
// 
// The code below is to hide the need to type 'prototype'
Function.prototype.method = function(name, func) {
	this.prototype[name] = func;
	return this;
};

Number.method('integer', function (){
	return Math[this < 0 ? 'ceil' : 'floor'](this);
});
document.writeln((-10/3).integer());

String.method('trim', function(){
	return this.replace(/^\s+|\s+$/g, '');
})
document.writeln('"' + "      neat     ".trim() + '"');


// Defensive technique to use
Function.prototype.method = function(name, func) {
	if (!this.prototype[name]) {  
		this.prototype[name] = func;
		return this;
	}
	
};

//--------------------------------
// 3.2 Recursion
//--------------------------------
var hanoi = function hanoi(disc, src, aux, dst) {
	if (disc > 0) {
		hanoi(disc - 1, src, aux, dst);
		document.writeln('Move disc ' + disc + ' from ' + src + ' to ' + dst);
		hanoi(disc -1, aux, src, dst);
	}
}

hanoi(3, 'Src', 'Aux', 'Dst');

// Recusive function can be very effective in manipulating tree structures.
var walk_the_DOM = function walk(node, func) {
	func(node);
	node = node.firstChild;
	while(node) {
		walk(node, func);
		node = node.nextSibling;
	}	
};

var getElementsByAttribute = function(att, value){
	var results = [];
	
	walk_the_DOM(document.body, function(node) {
		var actual = node.nodeType === 1 &&  node.getAttribute(att);
		if(typeof actual === 'string' && (actual === value || typeof valye !== 'string')) {
			results.push(node);
		}
	});
	
	return results;
};

// When the return is calling itself, it is a 'tail' recursion 
var factorial = function factorial(i, a) {
	a = a || 1;
	if (i < 2) {
		return a;
	}
	return factorial(i - 1, a * i);
};

document.writeln(factorial(4));

//--------------------------------
// 3.3 Scope
//--------------------------------
// Scope controls the visibility and lifetimes of variables and parameters
//  * javaScript does not not have block scope even though its block syntax suggests that it does.
//  * JavaScript does have function scope, meaning a variables defined inside a function is not visible outside it.
//  * Best to declare all variables used in function at the top, because of its lack of block scope.
var foo = function() {
	
	var a = 3, b = 5;
	
	var bar = function(){
		var b = 7, c = 11;
		document.writeln("a is " + a + ", b is " + b + ", and c is " + c)
		
		a += b + c;
		document.writeln("a is " + a + ", b is " + b + ", and c is " + c)
	};
	document.writeln("a is " + a + ", b is " + b )
	
	bar();
	document.writeln("a is " + a + ", b is " + b )
}

foo();

//--------------------------------
// 3.4 Closure
//--------------------------------
// * Initialise MyObject by calling a function that returns an object literal.
// * By using () on the last line, we are assigning the result of invoking that function, 
//   which is an object containing the two methods, which in turns still have access 
//   to 'value'.
var myObject = (function(){
	var value = 0;
	
	return {
		increment: function(inc) {
			value += typeof inc === 'number' ? inc : 1;
		},
		getValue: function(){
			return value;
		}
	}
}());


var quo = function(status) {
	return {
		get_status: function() {
			return status;
		}
	};
};

var myQuo = quo("amaazed");
document.writeln(myQuo.get_status());

var fade = function(node){
	var level = 1;
	var step = function() {
		var hex = level.toString(16);
		node.style.backgroundColor = '#FFFF' + hex + hex;
		if(level < 15){
			level += 1;
			setTimeout(step, 100);
		}
	};
	setTimeout(step, 100);
};

//fade(document.body);

// Bad Example
var add_the_handlers = function(nodes){
	var i;
	for (i = 0; i < nodes.length; i += 1) {
		nodes[i].onclick = function(e) {
			alert(i);
		};
	}
};

//add_the_handlers(document.body);

// Better example
// * Avoided create function within loop
var add_the_handlers = function (nodes) {
	var helper = function (i) {
		return function (e) {
			alert(i);
		};
	};
	var i;
	for (i =0; i< nodes.length; i += 1) {
		nodes[i].onclick = helper(i);
	}
};

//add_the_handlers(document.body);

//--------------------------------
// 3.5 Callbacks
//--------------------------------
//request = prepare_the_request();
//send_request_asynchronously(request, function(response) {
//	display(response);
//});


//--------------------------------
// 3.6 Module
//--------------------------------
// A module is a function or object that presents an interface but hides its state and implementation.

String.method('deentityfy', function(){
	
	// The entity tables
	var entity = {
			quot: '"',
			lt:'<',
			gt: '>'
	};
	
	// return the deentityfy method
	return function () {
		
		//this is the deentityfy method
		return this.replace(/&([^&;]+);/g, 
				function (a, b) {
					var r = entity[b];
					return typeof r === 'string' ? r : a;
				}
		);
	};
}()); // immediately invoke and return the function

document.writeln('&lt;&quot;&gt;'.deentityfy());


var serial_maker = function () {
	var prefix = '';
	var seq = 0;
	return {
		set_prefix: function(p){
			prefix = String(p);
		},
		set_seq: function(s){
			seq = s;
		},
		gensym: function() {
			var result = prefix + seq;
			seq += 1;
			return result;
		}
	};
};

var seqer = serial_maker();
seqer.set_prefix('Q');
seqer.set_seq(1000);
var unique = seqer.gensym();

//--------------------------------
// 3.7 Cascade
//--------------------------------
// 
// the ability to call many methods on the same object in sequnce in a single statement.
//

//--------------------------------
//3.8 Curry
//--------------------------------
//
// Currying is when you produce a new function by combining a function and an argument.
//
//var add1 = add.curry(1);
//document.writeln(add1(6));

Function.method('curry', function() {
	var slice = Array.prototype.slice,
		rgs = slice.apply(arguments), 
		that = this;
	return function () {
		return that.apply(null, args.concat(slice.apply(arguments)));
	};
});

//--------------------------------
// 3.8 Memoization
//--------------------------------
//
// Memoization is the usage of objects within a function to remeber the results of the previous operations.
var fibonacci = (function(){
	var memo = [0,1];
	var fib = function (n) {
		var result = memo[n];
		if (typeof result !== 'number'){
			result = fib(n-1) + fib(n-2);
			memo[n] = result;
		}
		return result;
	};
	return fib;
}());

//generalize
var memoizer = function(memo, formula) {
	var recur = function(n){
		var result = memo[n];
		if(typeof result !== 'number') {
			result = formula(recur, n);
			memo[n] = result;
		}
		return result;
	}
	return recur;
};

var fibonacci = memoizer([0,1], function(recur, n) {
	return recur(n-1) + recur(n-2);
});

var factorial = memoizer([1,1], function(recur, n) {
	return n * recur(n-1); 
}) 