'use strict';

const core = require('./ali-ots-core.js');
const pb = require('./ali-ots-pb.js');

const ListTable = require('./action/ListTable.js');
const DescribeTable = require('./action/DescribeTable.js');
const CreateTable = require('./action/CreateTable.js');

const create = (ots_name, region, key, secret, intra = false) => {

	let staff = core(ots_name, region, key, secret, intra);

	return {
		ListTable: data => ListTable(staff, data),
		DescribeTable: data => DescribeTable(staff, data),
		CreateTable: data => CreateTable(staff, data)
	}
}

module.exports = { create: create }