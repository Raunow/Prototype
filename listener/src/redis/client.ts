import Redis from 'ioredis';

const RedisPub = new Redis({ port: 6379, host: '127.0.0.1' });
const RedisSub = new Redis({ port: 6379, host: '127.0.0.1' });

for (const topic of ['in', 'to', 'test']) {
	console.log(topic)
}


