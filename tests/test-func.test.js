const { workerPool } = require('./test-setup.mjs');

afterAll(() => {
	workerPool.stop();
})

test('Task: log-stuff', () => {
	let options = {
		context: { test: 'test', blah: 'blah' },
		filename: 'log-stuff'
	}

	workerPool.run(() => options, (err, result) => {
		expect(err).toBeNull();
		expect(result.log[0]).toBe(options.context);
		expect(result.log.length).toBe(3);
		expect(result.return).toBe(true);
	});
});

test('Task: test-func', () => {
	let options = {
		context: { name: "steffen", lname: "poulsen" },
		filename: 'test-func'
	}

	workerPool.run(() => options, (err, result) => {
		expect(err).toBeNull();
		expect(result.log.length).toBe(0);
		expect(result.return === `${ctx.lname} ${ctx.name}` || result.return === `${ctx.name} ${ctx.lname}`).toBe(true)
	});
});

test('Task: arrigo-login', async () => {
	let options = {
		context: { account: "api_develop", username: "steffen", password: 'steffen123' },
		filename: 'test-func'
	}

	workerPool.run(() => options, (err, result) => {
		expect(err).toBeNull();
		expect(result.log.length).toBe(0);
		expect(result.authToken && result.refreshToken).toBe(true);
	});
});
