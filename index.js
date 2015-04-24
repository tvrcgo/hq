
var co = require('co');
var Emitter = require('events').EventEmitter;

/* Constructor */
var HQ = module.exports = function(){
	if (!(this instanceof HQ)) return new HQ;
	this.middleware = [];
	this.data = [];
}


/* Prototype */
var hq = HQ.prototype;


/* Inherit from `Emitter.prototype`. */
Object.setPrototypeOf(HQ.prototype, Emitter.prototype);


/* Add middleware */
hq.use = function(mw){
	if ( mw && 'GeneratorFunction' == mw.constructor.name ) {
		this.middleware.push(mw);
	}
	return this;
}


/* Process start. */
hq.start = function(){
	var mw = [process].concat(this.middleware);
	var fn = co.wrap(compose(mw));
	fn.call(this).catch(this.onerror);
};

/* Final process */
function *process(next){
	yield *next;
	// TODO
}


/* Compose middlewares */
function compose(middleware){
	return function *(){
		var i = middleware.length;
		var next = function *(){};
		var mw;

		while (i--) {
			mw = middleware[i];
			next = mw.call(this, next);
		}

		yield *next;
	}
}