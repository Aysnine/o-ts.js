'use strict';

const pb = require('./../ali-ots-pb.js');
const tp = require('./../action-template.js');

const Oper = (staff, data) => tp(staff, 'ListTable', data, {

	helper: data => '',

	encoder: data => pb('ListTableRequest').load(data).full_obj(),

	decoder: data => pb('ListTableResponse').load(data).full_obj()
});

module.exports = Oper;