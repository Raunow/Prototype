let req = https.request({
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
			log(data);
		});
	});

req.on("error", (err) => {
	log(err);
});

req.write(JSON.stringify({
	account: context.account,
	username: context.username,
	password: context.password
}));

req.end();
