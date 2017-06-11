'use strict';

const pb = require('./../ali-ots-pb.js');
const tp = require('./../action-template.js');

const Oper = (staff, data) => tp(staff, 'DescribeTable', data, {

	helper: table_name => ({ tableName: table_name }),

	encoder: data => pb('DescribeTableRequest').load(data).to_buf(),

	decoder: data => pb('DescribeTableResponse').load(data).full_obj()
});

module.exports = Oper;