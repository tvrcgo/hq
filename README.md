# hq

做数据收集，用中件间模式串联任务。

## Installation

```sh
npm install hq
```

## Usage

### use middleware

```js
var hq = require('hq');

var h1 = hq();

h1.use(function *(next){
	//do sth.
    yield next;
});

h1.use(function *(next){
	//do sth.
});

h1.start();
```

### mount hq instance

```js
var h1 = hq();
var h2 = hq();

h1.use(function *(next){
	console.log('h1-1');
	yield next;
});

h2.use(function *(next){
	yield next;
	console.log('h2-1');
});

h2.use(function *(next){
	console.log('h2-2');
});

// mount h2
h1.use(h2);

h1.use(function *(next){
	console.log('h1-2');
}); 

h1.start();

/**
* console result:
* h1-1
* h2-2
* h2-1
* h1-2
*/

```


## License

MIT
