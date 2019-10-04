import Redis from 'ioredis';

const redis = new Redis({ port: 30123, host: '192.168.20.23' });

redis.on('pmessage', (pattern, channel, message) => {
	console.log(pattern, `${channel}: ${message}`);
})

redis.on('message', (channel, message) => {
	console.log(channel, message);
})

redis.psubscribe('*');

redis.subscribe('TEST', (error, count) => {
	if (error) {
		throw new Error(error);
	}
	console.log(`Subbed to ${count} channels`);
})