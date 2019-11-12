const { workerData, parentPort } = require('worker_threads')

let rnd = (Math.round(Math.random() * 2));
console.log(workerData)

if (rnd === 1) {
	parentPort.postMessage(`${workerData.name} ${workerData.lname}`);
} else {
	parentPort.postMessage(`${workerData.lname} ${workerData.name}`);
}

