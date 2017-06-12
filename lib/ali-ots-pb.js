'use strict';

const path = require('path');
const protobuf = require('protobufjs');

const PGK_PATH = 'com.alicloud.openservices.tablestore.core.protocol';
const root = protobuf.loadSync(path.join(__dirname ,'/proto/table_store.proto'));

const path_pt = name => PGK_PATH +'.'+ name;
const get_pt = name => root.lookupType(path_pt(name));

const ERR_LIB = [
	'OTSRequestBodyTooLarge',
	'OTSRequestTimeout',
	'OTSMethodNotAllowed',
	'OTSAuthFailed',
	'OTSInternalServerError',
	'OTSQuotaExhausted',
	'OTSParameterInvalid',
	'OTSServerBusy',
	'OTSPartitionUnavailable',
	'OTSTimeout',
	'OTSServerUnavailable',
	'OTSRowOperationConflict',
	'OTSObjectAlreadyExist',
	'OTSObjectNotExist',
	'OTSTableNotReady',
	'OTSTooFrequentReserved',
	'OTSCapacityUnitExhausted',
	'OTSConditionCheckFail',
	'OTSOutOfRowSizeLimit',
	'OTSOutOfColumnCountLimit',
	'OTSInvalidPK'
];

const to_obj = (msg_pt, mix) => {
	return mix instanceof Buffer ?
		msg_pt.toObject(msg_pt.decode(mix)) : mix;
}

const to_buf = (msg_pt, mix) => {
	let err = msg_pt.verify(mix);
	if (err) throw Error(err);

	let msg = msg_pt.create(mix);

	return msg_pt.encode(msg).finish();
}

const is_err = (err_pt, mix) => {
	let obj;

	if (mix instanceof Buffer)
		try {
			obj = err_pt.toObject(err_pt.decode(mix));
		} catch (err) { obj = mix } // ignore Error type		
	else
		obj = mix;

	return (!obj.code || ERR_LIB.indexOf(obj.code) === -1)? false : obj;
}

const full_obj = (msg_pt, err_pt, mix) => {
	let rst = is_err(err_pt, mix);
	if (rst) return rst;

	return to_obj(msg_pt, mix)
}

const pb = pt_type => {

	const msg_pt = get_pt(pt_type);
	const err_pt = get_pt('Error');

	return {
		load: mix => {
			return {
				is_err: _ => is_err(err_pt, mix),
				to_obj: _ => to_obj(msg_pt, mix),
				to_buf: _ => to_buf(msg_pt, mix),
				full_obj: _ => full_obj(msg_pt, err_pt, mix)
			}
		}
	}
}

module.exports = pb;