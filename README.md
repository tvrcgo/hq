# hq

流处理中件间框架。

[![npm version](https://badge.fury.io/js/hq.svg)](http://badge.fury.io/js/hq)

## Installation

```sh
npm install hq
```

## Usage

### 流式输入数据

```js
var hq = require('hq');
var request = require('request');

var h1 = hq();
request('http://movie.douban.com/').pipe(h1);
```

### 添加中间件

```js
var h1 = hq();

h1.use(function *(next){
    yield next;
    console.log('h1-1');
});

h1.use(function *(next){
	console.log('h1-2');
});

h1.start();
```

一次添加多个中间件

```js
h1.use(function *(next){
	yield next;
	console.log('h1-1');
}, function *(next){
	console.log('h1-2');
});
```

### 合并其它 hq 对象的中间件

将其它 hq 对象的所有中间件合并到当前对象中。

```js
var h2 = hq();

h2.use(h1);

h2.start();
```

### 挂载其它 hq 对象

从挂载点进入被挂载对象的中间件，先执行完挂载对象的所有中间件再返回主对象的挂载点继续往下执行。

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
}, function *(next){
	console.log('h2-2');
});

// mix instance `h2`
h1.mix(h2);

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

### 错误处理

全局错误捕捉，只要一处定义就够了。

```js
h1.on('error', function(err){
	console.log(err);
});
```


## License

MIT
