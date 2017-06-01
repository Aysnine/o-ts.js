'use strict';

const crypto = require('crypto');
const axios = require('axios');

const make_md5_base64 = (str) => {
	let md5sum = crypto.createHash('md5');
	md5sum.update(str);
	return md5sum.digest('base64');
}
const make_hmac_sha1_base64 = (str, secret) => {
	let hmac = crypto.createHmac('sha1', secret);
	hmac.update(str);
	return hmac.digest('base64');
}

const make_defaults_base_url = (ots_name, region) => {
	return 'http://'+ ots_name +'.'+ region +'.ots.aliyuncs.com/'
}
const make_intranet_base_url = (ots_name, region) => {
	return 'http://'+ ots_name +'.'+ region +'.ots-internal.aliyuncs.com/'
}

const stringify_head = (hd) => {
	let str = '';
	for (let key of Object.keys(hd)) {
		str += key +':'+ hd[key] +'\n'
	}
	return str;
}

const sign_request_header = (ots_hd, uri, secret) => {
	let str = uri +'\nPOST\n\n'+ stringify_head(ots_hd);
	return make_hmac_sha1_base64(str, secret);
}
/*
const sign_response_header = (ots_hd, uri, secret) => {
	let str = stringify_head(ots_hd) + uri;
	return make_hmac_sha1_base64(str, secret);
}*/

const make_request_header = (ots_name, uri, key, secret, body) => {

	let hd = {
		'x-ots-accesskeyid': key,
		'x-ots-apiversion': '2014-08-08',
		'x-ots-contentmd5': make_md5_base64(body),
		'x-ots-date': new Date().toUTCString(),
		'x-ots-instancename': ots_name,
	};

	hd['x-ots-signature'] = sign_request_header(hd, uri, secret);

	return hd;
}

const create_request_staff = (ots_name, region, operation, key, secret, body, intra = false) => {

	let ax = axios.create({

		responseType: 'arraybuffer', // ! important

		baseURL: intra?
			make_intranet_base_url(ots_name, region):
			make_defaults_base_url(ots_name, region),

		headers: make_request_header(ots_name, '/'+ operation, key, secret, body),

		transformRequest: [],
		transformResponse: []
	});

	return {
		config: (handle) => {
			handle(ax); // for custom
			return ax.post('/'+ operation, body); // ! only post
		}
	}
}

module.exports = (ots_name, region, key, secret, intra = false) => {

	return {
		exec: (operation, body) => create_request_staff(ots_name, region, operation, key, secret, body, intra)
	}
}