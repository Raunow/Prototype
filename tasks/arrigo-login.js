const { workerData, parentPort } = require('worker_threads')
const { request } = require('https');

try {

	let req = request({
		protocol: 'https:',
		hostname: 'arrigo.rssoftware.se',
		port: 443,
		path: '/api/login',
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		}
	},
		(resp) => {
			let data = '';
			resp.on('data', (chunk) => {
				data += chunk;
			});
			resp.on('end', () => {
				parentPort.postMessage(data);
			});
		});

	req.on("error", (err) => {
		parentPort.postMessage(err);
	});

	req.write(JSON.stringify({
		account: workerData.account,
		username: workerData.username,
		password: workerData.password
	}));

	req.end();

} catch (error) {
	parentPort.postMessage(error)
}