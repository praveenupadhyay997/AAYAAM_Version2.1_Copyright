var configKey = require('./keys');
var axios = require('axios');

var config = {
	method: 'post',
	url: configKey.smsUrl,
	headers: {
		'Content-Type': 'application/json',
		'x-api-key': configKey.smsApiKey,
		Authorization: configKey.smsAuthKey,
	},
	data: null,
};

module.exports.sendSms = function (data) {
	config.data = data;
	axios(config)
		.then(function (response) {
			console.log(JSON.stringify(response.data));
		})
		.catch(function (error) {
			console.log(error);
		});
};
