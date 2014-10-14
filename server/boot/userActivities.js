var app = require('../server');
var loopback = require('loopback');
var moment = require('moment');
var ds = app.dataSources.fitbit;
var activityModel = ds.createModel('Activities', {}, {base:loopback.Model});
var oauth_signature = require('oauth-signature');

//activityModel.getUserActivities = function(data, cb){
//	console.log(data);
//	cb(null, data);
//};

//activityModel.getUserActivities.shared = true;
//activityModel.getUserActivities.accepts = [{arg: 'date', type: 'string', http: {source: 'path'}}];
//activityModel.getUserActivities.returns = [{arg: 'data', type: 'object', root: true} ];
//activityModel.getUserActivities.http = {verb: 'get', path: '/:date'};

exports.getUserActivities = function(accessToken, tokenSecret, cb){
	console.log('accessToken: ', accessToken);
	
	
activityModel.getUserActivities('2012-12-10', moment().unix(), accessToken, generateSignature('2012-12-10', accessToken, tokenSecret).toString(), app.get('callbackURL'), 
	function(err, data){
  	console.log('Data: ', data);
  	console.log('Err: ', err);
  	cb(data);
  });
};

app.model(activityModel);

module.exports.activityModel = activityModel;

function generateSignature(date, accessToken, tokenSecret){
	var parameters = {
    oauth_consumer_key : app.get('clientID'),
    oauth_token : accessToken,
    oauth_nonce : 'fvrebrberereber',
    oauth_timestamp : moment().unix(),
    oauth_signature_method : 'HMAC-SHA1',
    oauth_version : '1.0'
  };
	
	var encodedSignature = oauth_signature.generate('GET', 
																									'https://api.fitbit.com/1/user/244X7H/activities/date/2012-12-10.json', 
																									parameters, 
																									app.get('clientSecret'), 
																									tokenSecret);
	console.log(encodedSignature);
	return encodedSignature;
};
