'use strict';

const assert = require('assert');

describe('rationalize.css', function () {

	before(function () {
		browser.url('/');
	});

	it('should have first box-sizing testing element with dimensions 100x100', function () {
		const size = browser.getElementSize('.Test-sandbox-boxSizing');
		assert.equal(size[0].width, 100);
		assert.equal(size[0].height, 100);
	});

	it('should have second box-sizing testing element with dimensions 130x130', function () {
		const size = browser.getElementSize('.Test-sandbox-boxSizing');
		assert.equal(size[1].width, 130);
		assert.equal(size[1].height, 130);
	});

});
