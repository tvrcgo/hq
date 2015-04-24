# hq

做数据收集，用中件间模式串联任务。

## Installation

```sh
npm install hq
```

## Usage

```js
var hq = require('hq');

var task = hq();

task.use(function *(next){
	//do sth.
    yield next;
});

task.use(function *(){
	request('http://example.com/data', function(err, res, body){
    	task.push(body);
    })
    yield next;
});

task.start();
```

