const { workerPool } = require('./test-setup.mjs');

afterAll(() => {
	workerPool.stop();
})

test('Task: log-stuff', done => {
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
		done();
	});
});

test('Task: test-func', done => {
	let options = {
		context: { name: "steffen", lname: "poulsen" },
		filename: 'test-func'
	}

	workerPool.run(() => options, (err, result) => {
		expect(err).toBeNull();
		expect(result.error).toBeUndefined();
		expect(result.logs).toBeUndefined();
		expect(result.value === `${options.context.lname} ${options.context.name}` || result.value === `${options.context.name} ${options.context.lname}`).toBe(true);
		done();
	});
});

test('Task: arrigo-login', done => {
	let options = {
		context: { account: "api_develop", username: "steffen", password: 'steffen123' },
		filename: 'arrigo-login'
	}

	workerPool.run(() => options, (err, result) => {
		expect(err).toBeNull();
		expect(result.error).toBeUndefined();
		expect(result.logs).toBeUndefined();
		expect(result.value.authToken).toBeDefined();
		expect(result.value.refreshToken).toBeDefined();
		done();
	});
});

test('Task: is missing', done => {
	let options = { filename: 'Task#500' };
	workerPool.run(() => options, (err, result) => {
		expect(err).toBeNull();
		expect(result.error.message).toMatch('Task does not exist');
		expect(result.logs).toBeUndefined();
		expect(result.value).toBeUndefined();
		done();
	});
});
