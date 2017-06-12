'use strict';

const pb = require('./ali-ots-pb.js');

const Oper = (staff, action, data, flow) => {

	// defaults
	flow.helper = flow.helper? flow.helper : (_data => _data);
	flow.teller = flow.teller? flow.helper : (_data => _data);

	return staff
	.exec(action, flow.encoder(flow.helper(data)))
	.config(ax => {
		ax.defaults.transformResponse.decoder = flow.decoder;
	})
	.then(res => flow.teller(res.data))
	.catch(err => {
		if (err.response && err.response.data);
			throw err.response.data
		throw err;
	});
}

module.exports = Oper;