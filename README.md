# ali-berries

基于 axios 的阿里云表格存储( Table Store) NodeJS 开发模块 axios based node.js module for the aliyun table-store (OTS)

> 记 2017.6.1，上午10点，一个小时前误删该代码无发恢复，靠记忆重写，真 TMD 刺激。。。

## 主要依赖的库

- axios
- protobufjs

## Example

```javascript
const ots = require('ali-berries');

// 创建数据库实例
const db = ots.create('foo', 'region', 'key', 'secret');

// 查看所有表
db.ListTable()
.then(data => console.log(data))
.catch(err => console.log(err.code +' : '+ err.message));

// 新建表
db.CreateTable({
	tableMeta: {
		tableName: 'first',
		primaryKey: [
			{ name: 'key1', type: 2, option: 1},
			{ name: 'key2', type: 2, option: 1},
			{ name: 'key3', type: 2 } 
		]
	}
})
.then(data => console.log(data))
.catch(err => console.log(err.code +' : '+ err.message));

// 查看指定表的详细信息
db.DescribeTable('first')
.then(data => console.log(data))
.catch(err => console.log(err.code +' : '+ err.message));

```
