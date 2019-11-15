// import Redis from 'ioredis';

// const redis = new Redis({ port: 6379, host: '127.0.0.1' });
// let keyPrefix = 'dev-';

// async function main() {
// 	let key = 'version';
// 	let val = await redis.get(key);

// 	if (!val) {
// 		await redis.multi()
// 			.set(keyPrefix + key, '1.0.10')
// 			.publish(keyPrefix + key, '1.0.10')
// 			.exec();
// 	}

// 	console.log('Publisher started');
// 	let topic = 'TEST';

// 	process.stdout.write(topic + ': ');
// 	process.openStdin().addListener('data', data => {
// 		let input: string = data.toString().trim();
// 		if (input.startsWith('>')) {
// 			topic = input.slice(1);
// 		} else {
// 			redis.publish(topic, input);
// 		}
// 		process.stdout.write(topic + ': ');
// 	});
// }

// main();