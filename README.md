# hq

流处理中件间框架

[![npm version](https://badge.fury.io/js/hq.svg)](http://badge.fury.io/js/hq)

## Installation

```sh
npm i hq
```

## Contents

- `use()` 添加中间件；合并其它 hq 对象的中间件
- `mix()` 挂载其它 hq 对象的中间件
- `exec()` 重用流
- `pipe()` 数据写入其它流

## Usage

### 中间件

#### 1. 添加中间件

`use()` 中间件是 Generator Function，ES6 的特性。

```js
var h1 = hq();

h1.use(function *(next){
    console.log('h1-1');
    yield next;
});

// 一次添加多个
h1.use(function *(next){
	yield next;
	console.log('h1-2');
}, function *(next){
	console.log('h1-3');
});
```

#### 2. 合并其它 hq 对象的中间件

`use()` 将目标 hq 对象的所有中间件合并到当前对象中。

```js
var h2 = hq();

h2.use(h1);
```

#### 3. 挂载其它 hq 对象的中间件

`mix()` 从挂载点开新分支，进入被挂载对象的中间件，先执行完挂载对象的所有中间件再返回主对象的挂载点继续往下执行。

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

/**
* console:
* h1-1
* h2-2
* h2-1
* h1-2
*/

```

### 流

#### 1. 流输入输出

```js
var hq = require('hq');
var request = require('request');

var h1 = hq();

h1.use(function *(){
	// 流接收的数据会存在 this.buffer 里面，自行处理
	this.data = Buffer.concat(this.buffer).toString('utf-8');
    yield next;
});

request('http://example.com/').pipe(h1).pipe(some_writable_stream);
```

### 2. 重用流

`exec()` 默认 stream 只能使用一次，重用流可以实现类似多个流对它的写入，达到重用中件间的目的。

```js
[url1, url2, url3].forEach(function(url){
	request(url).pipe(h1.exec());
})
```

### 错误处理

全局错误捕捉，一处定义就够了。

```js
h1.on('error', function(err){
	console.log(err);
});
```


## License

MIT
