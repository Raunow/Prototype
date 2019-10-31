import { connect, IClientOptions } from 'mqtt';

let topic = 'presence';
let URL = 'mqtt://192.168.20.24:30123';
let OPTIONS: IClientOptions = {
	reconnectPeriod: 1000,

}

async function main() {
	try {
		console.log('Starting')
		let client = connect(URL, OPTIONS);
		client.on('connect', async (msg) => {
			client.subscribe('#', (err) => {
				if (!err) {
					//client.publish(topic, 'Online');
				}
			});
		});

		client.on('message', async (_topic, msg, packet) => {
			console.log('%s:\n\t%s', _topic, JSON.parse(msg.toString()).node);
		})
	} catch (e) {
		console.log(e)
	}
}


main();