'use strict';

const http = require('http');
const ws = require('local-web-server');
const shutdown = require('http-shutdown');

let server, config;

const local = typeof process.env.CI === 'undefined' || process.env.CI === 'false';
const port = 9002;

if ( local ) {
	config = {
		baseUrl: `http://host.docker.internal:${port}`,
		services: ['docker'],
		capabilities: [{
			browserName: 'chrome'
		}],
		dockerLogs: './wdioDockerLogs',
		dockerOptions: {
			image: 'selenium/standalone-chrome',
			healthCheck: 'http://localhost:4444',
			options: {
				p: ['4444:4444'],
				shmSize: '2g'
			}
		}
	};
} else {
	config = {
		baseUrl: `http://localhost:${port}`,
		user: process.env.BROWSER_STACK_USERNAME,
		key: process.env.BROWSER_STACK_ACCESS_KEY,
		browserstackLocal: true,
		services: ['browserstack'],
		capabilities: [{
			browser: 'Chrome',
			os: 'Windows',
			'os_version': '7',
			project: 'rationalize-css',
			build: 'Integration (WebdriverIO)',
			name: 'Chrome',
			browserName: 'Chrome',
			'browserstack.local': 'true',
			'browserstack.debug': 'true'
		}, {
			browser: 'Firefox',
			os: 'Windows',
			'os_version': '7',
			project: 'rationalize-css',
			build: 'Integration (WebdriverIO)',
			name: 'Firefox',
			browserName: 'Firefox',
			'browserstack.local': 'true',
			'browserstack.debug': 'true'
		}, {
			browser: 'IE',
			'browser_version': '9',
			os: 'Windows',
			'os_version': '7',
			project: 'rationalize-css',
			build: 'Integration (WebdriverIO)',
			name: 'IE9',
			browserName: 'IE9',
			'browserstack.local': 'true',
			'browserstack.debug': 'true'
		}]
	};
}

module.exports.config = Object.assign({
	specs: [
		'./test/integration/**/*.js'
	],
	exclude: [],
	maxInstances: 10,
	sync: false,
	logLevel: 'silent',
	coloredLogs: true,
	screenshotPath: './errorShots/',
	screenshotOnReject: true,
	waitforTimeout: 10000,
	connectionRetryTimeout: 90000,
	connectionRetryCount: 3,
	framework: 'mocha',
	reporters: ['spec'],
	mochaOpts: {
		require: ['esm']
	},
	onPrepare: function ( currentConfig ) {

		return new Promise(( resolve, reject ) => {

			server = shutdown(http.createServer(ws({
				'static': {
					root: './test-dist'
				},
				serveIndex: {
					path: './test-dist'
				},
				log: {
					format: currentConfig.logLevel === 'verbose' ? 'tiny' : 'none'
				}
			}).callback()));

			console.log(`Starting local web server on port ${port}…`);
			server.listen(port);

			console.log('Starting WebdriverIO…');
			resolve();

		});

	},

	onComplete: function () {

		return new Promise(( resolve, reject ) => {

			console.log('Stopping local web server…');
			server.shutdown();

			console.log('Stopping WebdriverIO…');
			resolve();

		});

	}
}, config);
