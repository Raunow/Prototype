import { readFile } from 'fs';
import { join } from 'path';
import { parentPort, workerData } from 'worker_threads';

class StateContainer {
	redis = 'Redis instance';
	get() {
		return this.redis;
	}
	set() {
		return true;
	}
}

const log = (...log: Array<any>) => parentPort.postMessage(log);
const state = new StateContainer();
const data = { ...workerData }
const params = [
	log,
	state,
	data
];

readFile(join(__dirname, '../..', `/tasks/${data.file}.js`), (err, buffer) => {
	if (err) throw err;

	let callable = new Function('log', 'state', 'data', buffer.toString())
	try {
		callable(...params);
	} catch (error) {
		log(error)
	}
});
