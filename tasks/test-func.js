const { workerData, parentPort } = require('worker_threads')

let rnd = (Math.round(Math.random() * 2));

if (rnd === 1) {
	parentPort.postMessage(`${workerData.name} ${workerData.lname}`);
	parentPort.postMessage(`${workerData.name} ${workerData.lname}`);
	parentPort.postMessage(`${workerData.name} ${workerData.lname}`);
} else {
	parentPort.postMessage(`${workerData.name} ${workerData.lname}`);
	parentPort.postMessage(`${workerData.name} ${workerData.lname}`);
	throw Error('ducked');
}

