import { request, RequestOptions } from 'http';
import Redis from 'ioredis';
import { join } from 'path';

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


function getRelativeTopic(blocks: Array<Block>, topics: Array<string>) {

}

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
		let constants = block.constants || undefined;

		if (name === 'Trigger') {
			if (inputs === undefined || inputs.topic === undefined) throw Error(`${title}: Missing subscription topic`);

			let topic = parent.inputs.topic  //getRelativeTopic(blocks, inputs.topics);
			let options = getOptions('');

			//alternative
			RedisSub.subscribe(topic, () => {
				topic => {
					// calculate what to do depending on the topic
				}
			})

			/*
			Meter updates -> {UID , null}

			channel === topic
			channel => Listening GQLquery block => query using $channel => publixh { account/user/apps/appID/GQLBlock, result opf query}



			*/




			//preferred
			RedisSub.subscribe(topic, getCallback(options, constants));
		}
	})
}


const resolvePath = (account: string) => join(__dirname, '../..', `/accounts/${account}.json`);

function parseConf(conf: Block) {
	// readFile(resolvePath(''), () => {
	// })

	return conf.children;
}

interface Block {
	name: string;
	title: string;
	inputs: { [key: string]: any };
	constants: { [key: string]: any };
	children: { [key: string]: Block };
}