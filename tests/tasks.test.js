const { workerPool } = require('./test-setup.mjs');

afterAll(() => {
	return workerPool.stop();
})

test('Task: log-stuff', async () => {
	let options = {
		context: { test: 'test', blah: 'blah' },
		filename: 'log-stuff'
	}

	await workerPool.run(() => options, (err, result) => {
		expect(err).toBeNull();
		expect(result.logs).toBeDefined()
		expect(result.logs[0]).toEqual(options.context);
		expect(result.logs.length).toBe(3);
		expect(result.value).toBeUndefined();
	});
});

test('Task: test-func', async () => {
	let options = {
		context: { name: "steffen", lname: "poulsen" },
		filename: 'test-func'
	}

	await workerPool.run(() => options, (err, result) => {
		expect(err).toBeNull();
		expect(result.error).toBeUndefined();
		expect(result.logs).toBeUndefined();
		expect(result.value === `${options.context.lname} ${options.context.name}` || result.value === `${options.context.name} ${options.context.lname}`).toBeTruthy();
	});
});

test('Task: arrigo-login', async () => {
	let options = {
		context: { account: "api_develop", username: "steffen", password: 'steffen123' },
		filename: 'arrigo-login'
	}

	await workerPool.run(() => options, (err, result) => {
		expect(err).toBeNull();
		expect(result.error).toBeUndefined();
		expect(result.logs).toBeUndefined();
		expect(result.value.authToken).toBeDefined();
		expect(result.value.refreshToken).toBeDefined();
	});
});

test('Task: is missing', async () => {
	let options = { filename: 'Task#500' };
	await workerPool.run(() => options, (err, result) => {
		expect(err).toBeNull();
		expect(result.error.message).toMatch('Task does not exist');
		expect(result.logs).toBeUndefined();
		expect(result.value).toBeUndefined();
	});
});
