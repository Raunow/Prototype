import Redis from 'ioredis';

const RedisPub = new Redis({ port: 6379, host: '127.0.0.1' });
const RedisSub = new Redis({ port: 6379, host: '127.0.0.1' });

for (const topic of ['in', 'to', 'test']) {
	console.log(topic)
}


//account/
//topic
//subscription
////type (code block)
////value (Name of task fx)


// api_develop_Meter_:   YXBpX2RldmVsb3BfTWV0ZXJf
// api_develop_Meter_1:  YXBpX2RldmVsb3BfTWV0ZXJfMQ==
// api_develop_Meter_10: YXBpX2RldmVsb3BfTWV0ZXJfMTA=

// api_develop_Meter_*:  YXBpX2RldmVsb3BfTWV0ZXJf*
