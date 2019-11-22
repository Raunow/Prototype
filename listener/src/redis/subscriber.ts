import Redis from 'ioredis';

const redis = new Redis({ port: 6379, host: '127.0.0.1', autoResubscribe: true });

console.log('Starting')

// redis.on('pmessage', (pattern, channel, message) => {
// 	console.log('%s %s: %s', pattern, channel, message);
// })

redis.on('message', (topic, message) => {
	console.log('%s: %s', topic, message);
})

// redis.psubscribe('*');
// redis.psubscribe('test/*');

redis.subscribe('dev-version');
redis.subscribe('TEST', (error, count) => {
	if (error) {
		throw new Error(error);
	}
	console.log(`Subbed to ${count} channels`);
});


