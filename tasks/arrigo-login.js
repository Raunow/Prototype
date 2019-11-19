let options = {
	protocol: 'https:',
	hostname: 'arrigo.rssoftware.se',
	port: 443,
	path: '/api/login',
	method: 'POST',
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	}
};

return new Promise((resolve, reject) => {
	let req = https.request(options,
		(resp) => {
			let data = '';
			resp.on('data', (chunk) => {
				data += chunk;
			});
			resp.on('end', () => {
				resolve(JSON.parse(data))
			});
		});

	req.on('error', (err) => {
		reject(err)
	});

	req.write(JSON.stringify({
		account: ctx.account,
		username: ctx.username,
		password: ctx.password
	}));

	req.end();
});
