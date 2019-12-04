import { request, RequestOptions } from 'http';
import Redis from 'ioredis';

//const RedisPub = new Redis({ port: 6379, host: '127.0.0.1' });
const RedisSub = new Redis({ port: 6379, host: '127.0.0.1' });

const getOptions = (taskID): RequestOptions => ({
	protocol: 'http:',
	hostname: 'localhost',
	port: 80,
	path: '/task/' + taskID,
	method: 'POST',
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	}
});



function getCallback(options, constants: any) {
	return () => {
		return new Promise((resolve, reject) => {
			let req = request(options, (resp) => {
				let data = '';

				resp.on('data', (chunk) => {
					data += chunk;
				});

				resp.on('end', () => {
					resolve(JSON.parse(data))
				});
			});

			req.on('error', (err) => {
				reject(err);
			})

			if (constants) req.write(JSON.stringify(constants));

			req.end();
		});
	}
}

function addSubscription(blocks: Array<Block>) {
	let parent = blocks.find((block) => block.name === 'T1')

	blocks.map((block) => {
		let name = block.name;
		let title = block.title;
		let inputs = block.inputs || undefined;

		if (name === 'Trigger') {
			if (inputs === undefined || inputs.topic === undefined) throw Error(`${title}: Missing subscription topic`);

			let topic = getRelativeTopic(blocks, inputs.topics);
			let options = getOptions('');

			//preferred
			RedisSub.subscribe(topic, getCallback(options, constants));
		}
	})
}





