var assert = require('assert');

describe('Basic', function () {

	var page;

	before(function () {
		page = browser.url('/basic');
		return page;
	});

	it('should have first box-sizing testing element with dimensions 100x100', function () {

		return page
			.getElementSize('.Test-sandbox-boxSizing')
				.then(function ( size ) {
					assert.equal(size[0].width, 100);
					assert.equal(size[0].height, 100);
				});

	});

	it('should have second box-sizing testing element with dimensions 130x130', function () {

		return page
			.getElementSize('.Test-sandbox-boxSizing')
				.then(function ( size ) {
					assert.equal(size[1].width, 130);
					assert.equal(size[1].height, 130);
				});

	});

});
