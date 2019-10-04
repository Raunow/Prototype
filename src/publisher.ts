import Redis from 'ioredis';
import { addListener } from 'cluster';

const stdin = process.openStdin();
const redis = new Redis({ port: 30123, host: '192.168.20.23' });

console.log('Publisher started');
let channel = 'TEST';

stdin.addListener('data', data => {
	let input: string = data.toString().trim();
	if (input.startsWith('>')) {
		channel = input.replace('>', '');
	} else {
		redis.publish(channel, input);
	}
})