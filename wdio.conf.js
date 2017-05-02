/* globals process:false */
/* eslint-disable no-process-env, no-process-exit, no-console */

'use strict';

const http = require('http');
const ws = require('local-web-server');
const shutdown = require('http-shutdown');
const execa = require('execa');
const minimist = require('minimist');
let server, config;

const args = minimist(process.argv.slice(2), {
	'default': {
		local: false,
		verbose: false,
		port: 9002
	}
});
const local = args.local;
const verbose = args.verbose;
const port = args.port;
const dockerhost = 'dockerhost';

if ( local ) {
	config = {
		baseUrl: `http://${dockerhost}:${port}`,
		capabilities: [{
			browserName: 'chrome'
		}]
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
	sync: true,
	logLevel: verbose ? 'verbose' : 'silent',
	coloredLogs: true,
	screenshotPath: './errorShots/',
	screenshotOnReject: true,
	waitforTimeout: 10000,
	connectionRetryTimeout: 90000,
	connectionRetryCount: 3,
	framework: 'mocha',
	reporters: ['spec'],
	mochaOpts: {
		ui: 'bdd'
	},
	onPrepare: function () {

		const startProcess = new Promise(( resolve, reject ) => {

			server = shutdown(http.createServer(ws({
				'static': {
					root: './test-dist'
				},
				serveIndex: {
					path: './test-dist'
				},
				log: {
					format: verbose ? 'tiny' : 'none'
				}
			}).callback()));

			console.log(`Starting local web server on port ${port}…`);
			server.listen(port);

			console.log('Starting WebdriverIO…');
			resolve();

		});

		return Promise.resolve()
			.then(() => {
				if ( local ) {
					return execa.shell(`docker run --name=wdio --add-host="${dockerhost}:10.0.2.2" -d -p 4444:4444 -v /dev/shm:/dev/shm selenium/standalone-chrome:2.53.0`)
						.then(( res ) => {
							console.log(res.stderr);
							console.log(res.stdout);
							return startProcess;
						});
				}
				return startProcess;
			})
			.catch(( err ) => {
				console.log(err);

				console.log('Stopping local web server…');
				server.shutdown();

				process.exit(1);
			});

	},

	onComplete: function () {

		const stopProcess = new Promise(( resolve, reject ) => {

			console.log('Stopping local web server…');
			server.shutdown();

			console.log('Stopping WebdriverIO…');
			resolve();

		});

		return Promise.resolve()
			.then(() => {
				if ( local ) {
					return execa.shell('docker stop wdio && docker rm wdio')
						.then(( res ) => {
							console.log(res.stdout);
							console.log(res.stderr);
							return stopProcess;
						});
				}
				return stopProcess;
			})
			.catch(( err ) => {
				console.log(err);
				process.exit(1);
			});

	}
}, config);
