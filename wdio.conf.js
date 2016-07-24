/* eslint-disable no-process-env, no-process-exit, quote-props */

var http = require('http');
var BrowserStackTunnel = require('browserstacktunnel-wrapper');
var ws = require('local-web-server');
var shutdown = require('http-shutdown');
var execa = require('execa');
var minimist = require('minimist');
var server, tunnel;

var args = minimist(process.argv.slice(2), {
	'default': {
		local: false,
		verbose: false,
		port: 9002
	}
});
var local = args.local;
var verbose = args.verbose;
var port = args.port;

var capabilities = [{
	browser: 'Chrome',
	os: 'Windows',
	'os_version': '7',
	project: 'rationalize.css',
	build: 'Integration (WebdriverIO)',
	name: 'Chrome',
	browserName: 'Chrome',
	'browserstack.local': 'true',
	'browserstack.debug': 'true'
}, {
	browser: 'Firefox',
	os: 'Windows',
	'os_version': '7',
	project: 'rationalize.css',
	build: 'Integration (WebdriverIO)',
	name: 'Firefox',
	browserName: 'Firefox',
	'browserstack.local': 'true',
	'browserstack.debug': 'true'
}, {
	browser: 'IE',
	'browser_version': '8',
	os: 'Windows',
	'os_version': '7',
	project: 'rationalize.css',
	build: 'Integration (WebdriverIO)',
	name: 'IE8',
	browserName: 'IE8',
	'browserstack.local': 'true',
	'browserstack.debug': 'true'
}];

if ( local ) {
	capabilities = [{
		browserName: 'chrome'
	}];
}

exports.config = {
	user: local ? null : process.env.BROWSER_STACK_USERNAME,
	key: local ? null : process.env.BROWSER_STACK_ACCESS_KEY,
	specs: [
		'./test/integration/**/*.js'
	],
	exclude: [],
	maxInstances: 10,
	capabilities: capabilities,
	sync: false,
	logLevel: verbose ? 'verbose' : 'silent',
	coloredLogs: true,
	screenshotPath: './errorShots/',
	baseUrl: (local ? 'http://dockerhost:' : 'http://localhost:') + port,
	waitforTimeout: 10000,
	connectionRetryTimeout: 90000,
	connectionRetryCount: 3,
	framework: 'mocha',
	reporters: ['spec'],
	mochaOpts: {
		ui: 'bdd'
	},
	onPrepare: function () {

		var startProcess = new Promise(function ( resolve, reject ) {

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

			console.log('Starting local web server on port ' + port + '…');
			server.listen(port);

			if ( local ) {

				console.log('Starting WebdriverIO…');
				resolve();

			} else {

				tunnel = new BrowserStackTunnel({
					key: process.env.BROWSER_STACK_ACCESS_KEY,
					hosts: [{
						name: 'localhost',
						port: port
					}]
				});

				console.log('Starting BrowserStack tunnel…');
				tunnel.start(function ( err ) {
					if ( err ) {
						reject(err);
						return;
					}

					console.log('Starting WebdriverIO…');
					resolve();
				});

			}

		});

		return Promise.resolve()
			.then(function () {
				if ( local ) {
					return execa.shell('docker run --name=wdio --add-host="dockerhost:10.0.2.2" -d -p 4444:4444 -v /dev/shm:/dev/shm selenium/standalone-chrome:2.53.0')
						.then(function ( res ) {
							console.log(res.stderr);
							console.log(res.stdout);
							return startProcess;
						});
				}
				return startProcess;
			})
			.catch(function ( err ) {
				console.log(err);

				console.log('Stopping local web server…');
				server.shutdown();

				process.exit(1);
			});

	},

	onComplete: function () {

		var stopProcess = new Promise(function ( resolve, reject ) {

			console.log('Stopping local web server…');
			server.shutdown();

			if ( local ) {

				console.log('Stopping WebdriverIO…');
				resolve();

			} else {

				console.log('Stopping BrowserStack tunnel…');
				tunnel.stop(function ( err ) {
					if ( err ) {
						reject(err);
						return;
					}

					console.log('Stopping WebdriverIO…');
					resolve();
				});

			}

		});

		return Promise.resolve()
			.then(function () {
				if ( local ) {
					return execa.shell('docker stop wdio && docker rm wdio')
						.then(function ( res ) {
							console.log(res.stdout);
							console.log(res.stderr);
							return stopProcess;
						});
				}
				return stopProcess;
			})
			.catch(function ( err ) {
				console.log(err);
				process.exit(1);
			});

	}
};
