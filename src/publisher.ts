import { connect, IClientOptions } from 'mqtt';

let topic = 'presence';
let URL = 'mqtt://localhost:1883';
let OPTIONS: IClientOptions = {
	reconnectPeriod: 1000
}

const main = async () => {
	let client = connect(URL, OPTIONS);

	process.on('exit', async () => {
		await client.end();
	})

	console.log('Publisher started');
	process.stdout.write(topic + ': ');

	process.openStdin().addListener('data', async data => {
		let input: string = data.toString().trim();
		if (input.startsWith('>')) {
			topic = input.slice(1);
		} else {
			client.publish(topic, Buffer.from(input));
		}
		process.stdout.write(topic + ': ');
	})
}

main();

//clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8)*/