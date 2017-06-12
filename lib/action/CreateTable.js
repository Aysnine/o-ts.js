'use strict';

const pb = require('./../ali-ots-pb.js');
const tp = require('./../action-template.js');

const Oper = (staff, data) => tp(staff, 'CreateTable', data, {

	helper: data => {

		let rst = {
			tableMeta: {
				tableName: data.name,
				primaryKey: data.keys.map(item => {

					let rst = {
						name: item.name,
						type: ['int', 'string', 'bin'].indexOf(item.type)+1
					};

					if (item.auto) rst.option = 1;
					return rst
				})
			},
			reservedThroughput: {
				capacityUnit: {
					read: 0,
					write: 0
				}
			}
		};

		return rst;
	},

	encoder: data => pb('CreateTableRequest').load(data).to_buf(),

	decoder: data => pb('CreateTableResponse').load(data).full_obj()
});

module.exports = Oper;