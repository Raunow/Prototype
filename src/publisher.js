"use strict";
exports.__esModule = true;
var ioredis_1 = require("ioredis");
var redis = new ioredis_1["default"]({ port: 6379, host: '127.0.0.1' });
console.log('Publisher started');
var topic = 'TEST';
process.openStdin().addListener('data', function (data) {
    var input = data.toString().trim();
    if (input.startsWith('>')) {
        topic = input.slice(1);
    }
    else {
        redis.publish(topic, input);
    }
    process.stdout.write(topic + ': ');
});
