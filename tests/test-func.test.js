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
		expect(result.logs).toBeDefined()
		expect(result.logs[0]).toEqual(options.context);
		expect(result.logs.length).toBe(3);
		expect(result.value).toBeUndefined();
	});
});

test('Task: test-func', () => {
	let options = {
		context: { name: "steffen", lname: "poulsen" },
		filename: 'test-func'
	}

	workerPool.run(() => options, (err, result) => {
		expect(err).toBeNull();
		expect(result.error).toBeUndefined();
		expect(result.logs).toBeUndefined();
		expect(result.value === `${ctx.lname} ${ctx.name}` || result.value === `${ctx.name} ${ctx.lname}`).toBe(true)
	});
});

test('Task: arrigo-login', () => {
	let options = {
		context: { account: "api_develop", username: "steffen", password: 'steffen123' },
		filename: 'test-func'
	}

	workerPool.run(() => options, (err, result) => {
		expect(err).toBeFalsy();
		expect(result.error).toBeUndefined();
		expect(result.logs).toBeUndefined();
		expect(result.value.authToken).toBeDefined();
		expect(result.value.refreshToken).toBeDefined();
	});
});

test('Task: is missing', () => {
	let options = { filename: 'Task#500' };

	workerPool.run(() => options, (err, result) => {
		expect(err).toBeNull();
		expect(result.error).toMatch('Error: Task does not exist');
		expect(result.logs).toBeUndefined(true);
		expect(result.value).toBeUndefined();
	});
});
