const request = require('request');
const req = request.defaults();
const fs = require('fs');
const config = require('../config/visa.config');
const VisaAPIClient = require('../app/libs/visaAPIClient.lib');
const assert = require('chai').assert;

console.log(__dirname);

var userId = config.userId ;
var password = config.password;
var keyFile = config.key;
var certificateFile = config.cert;

describe('Visa Direct Pull Funds Transactions test', function() {
	let visaAPIClient = new VisaAPIClient();
	let strDate = new Date().toISOString().replace(/\..+/, '');
	let pullFundsRequest = JSON.stringify({
		  "acquirerCountryCode": "840",
		  "acquiringBin": "408999",
		  "amount": "124.02",
		  "businessApplicationId": "AA",
		  "cardAcceptor": {
		    "address": {
		      "country": "USA",
		      "county": "San Mateo",
		      "state": "CA",
		      "zipCode": "94404"
		    },
		    "idCode": "ABCD1234ABCD123",
		    "name": "Visa Inc. USA-Foster City",
		    "terminalId": "ABCD1234"
		  },
		  "cavv": "0700100038238906000013405823891061668252",
		  "foreignExchangeFeeTransaction": "11.99",
		  "localTransactionDateTime": strDate,
		  "retrievalReferenceNumber": "330000550000",
		  "senderCardExpiryDate": "2015-10",
		  "senderCurrencyCode": "USD",
		  "senderPrimaryAccountNumber": "4895142232120006",
		  "surcharge": "11.99",
		  "systemsTraceAuditNumber": "451001",
			"merchantCategoryCode": 6012
		});

	it('Pull Funds Transaction Test',function(done) {
		this.timeout(10000);
		let baseUri = 'visadirect/';
		let resourcePath = 'fundstransfer/v1/pullfundstransactions';
		visaAPIClient.doMutualAuthRequest(baseUri + resourcePath, pullFundsRequest, 'POST', {},
		function(err, responseCode) {
			if(!err) {
				assert.equal(responseCode, 200);
			} else {
				assert(false);
			}
		    done();
		});
	});
});

describe('Visa Direct Push Funds Transactions test', function() {
	let visaAPIClient = new VisaAPIClient();
	let strDate = new Date().toISOString().replace(/\..+/, '');
	let pushFundsRequest = JSON.stringify({
		  "systemsTraceAuditNumber": 350420,
		  "retrievalReferenceNumber": "401010350420",
		  "localTransactionDateTime": strDate,
		  "acquiringBin": 409999,
		  "acquirerCountryCode": "101",
		  "senderAccountNumber": "1234567890123456",
		  "senderCountryCode": "USA",
		  "transactionCurrencyCode": "USD",
		  "senderName": "John Smith",
		  "senderAddress": "44 Market St.",
		  "senderCity": "San Francisco",
		  "senderStateCode": "CA",
		  "recipientName": "Adam Smith",
		  "recipientPrimaryAccountNumber": "4957030420210454",
		  "amount": "112.00",
		  "businessApplicationId": "PP",
		  "transactionIdentifier": 234234322342343,
		  "merchantCategoryCode": 6012,
		  "sourceOfFundsCode": "03",
		  "cardAcceptor": {
		    "name": "John Smith",
		    "terminalId": "13655392",
		    "idCode": "VMT200911026070",
		    "address": {
		      "state": "CA",
		      "county": "081",
		      "country": "USA",
		      "zipCode": "94105"
		    }
		  },
		  "feeProgramIndicator": "123"
		});

	it('Push Funds Transaction Test',function(done) {
		this.timeout(10000);
		let baseUri = 'visadirect/';
		let resourcePath = 'fundstransfer/v1/pushfundstransactions';
		visaAPIClient.doMutualAuthRequest(baseUri + resourcePath, pushFundsRequest, 'POST', {},
		function(err, responseCode) {
			if(!err) {
				assert.equal(responseCode, 200);
			} else {
				assert(false);
			}
		    done();
		});
	});
});

// req.post({
//     uri : "https://sandbox.api.visa.com/",
//     key: fs.readFileSync(keyFile),
//     cert: fs.readFileSync(certificateFile),
//     ca: fs.readFileSync(caFile),
//     headers: {
//       'Content-Type' : 'application/json',
//       'Accept' : 'application/json',
//       'Authorization' : 'Basic ' + new Buffer(userId + ':' + password).toString('base64')
//     },
//     body: data
//   }, function(error, response, body) {
//     console.log("Response: ", response);
//     console.log("Body: ", body);
//     console.error("Error: ", error);
//   }
// );