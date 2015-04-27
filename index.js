
var co = require('co');
var Transform = require('stream').Transform;

/**
* Constructor 
*/
var HQ = module.exports = function(){
	if (!(this instanceof HQ)) return new HQ;
	Transform.call(this);
	this.middleware = [];
	this.buffer = [];
}

/**
* Inherit from `Transform.prototype`. 
*/
Object.setPrototypeOf(HQ.prototype, Transform.prototype);

/**
* Prototype 
*/
var hq = HQ.prototype;

hq._transform = function(chunk, encoding, done){
	this.buffer.push(chunk);
	done();
}

hq._flush = function(done){
	this.push(Buffer.concat(this.buffer));
	this.start();
	done();
}

/**
* Add middleware 
*/
hq.use = function(){

	var mw = ( arguments.length == 1 ? arguments[0] : [].slice.call(arguments) );

	// use single middleware
	if ( mw && 'GeneratorFunction' == mw.constructor.name ) {
		this.middleware.push(mw);
	}

	// use multiple middlewares
	if ( mw && mw.length && 'Array' == mw.constructor.name ) {
		this.middleware = mw.concat(this.middleware);
	}

	// merge other hq middlewares
	if (mw && mw instanceof HQ) {
		this.middleware.push(function *(next){
			yield compose(mw.middleware).call(this, next);
		});
	}

	return this;
}

/**
* Mount hq
*/
hq.mix = function(hq){
	
	if ( hq && hq instanceof HQ ) {
		this.middleware.push(function *(next){
			yield compose(hq.middleware);
			yield next;
		});
	}
	
	return this;
}

/**
* Process middlewares. 
*/
hq.start = function(){
	var mw = [process].concat(this.middleware);
	var fn = co.wrap(compose(mw));
	var self = this;
	fn.call(this).catch(function(err){
		self.emit('error', err);
	});
};

/**
* Final process 
*/
function *process(next){
	yield *next;
	//TODO finally
}

/**
* Compose middlewares 
*/
function compose(middleware){
	return function *(next){
		var i = middleware.length;
		next = next || function *(){};
		var mw;

		while (i--) {
			mw = middleware[i];
			next = mw.call(this, next);
		}

		yield *next;
	}
}