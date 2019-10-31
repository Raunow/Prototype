"use strict";
exports.__esModule = true;
var ioredis_1 = require("ioredis");
var redis = new ioredis_1["default"]({ port: 6379, host: '127.0.0.1' });
console.log('Starting');
redis.on('pmessage', function (pattern, channel, message) {
    console.log('%s %s: %s', pattern, channel, message);
});
redis.on('message', function (channel, message) {
    console.log('%s: %s', channel, message);
});
redis.psubscribe('*');
redis.subscribe('TEST', function (error, count) {
    if (error) {
        throw new Error(error);
    }
    console.log("Subbed to " + count + " channels");
});
