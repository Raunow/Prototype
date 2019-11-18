const { join } = require('path')
const { WorkerPool } = require('../dist/workers/WorkerPool');


let path = join(__dirname, '..', `\\dist\\workers\\worker.js`);
const workerPool = new WorkerPool(path, 1);


module.exports = {
	workerPool: workerPool
}