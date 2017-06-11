'use strict';

const pb = require('./../ali-ots-pb.js');
const tp = require('./../action-template.js');

const Oper = (staff, data) => tp(staff, 'CreateTable', data, {

	helper: form => {
		// defaults
		form.reservedThroughput = {
			capacityUnit: {
				read: 0,
				write: 0
			}
		}
		return form
	},

	encoder: data => pb('CreateTableRequest').load(data).to_buf(),

	decoder: data => pb('CreateTableResponse').load(data).full_obj()
});

module.exports = Oper;