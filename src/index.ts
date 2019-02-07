import { app } from './clusterApp';
import { Tracer, ExplicitContext , jsonEncoder, BatchRecorder, Instrumentation, sampler } from 'zipkin';
import { HttpLogger } from 'zipkin-transport-http';

let tracer: Tracer = new Tracer({
    ctxImpl: new ExplicitContext(),
    recorder: new BatchRecorder({
        logger: new HttpLogger({
            endpoint: 'http://localhost:9411/api/v2/spans',
            jsonEncoder: jsonEncoder.JSON_V2
        })
    }),
    localServiceName: 'Arrigo dev-Zipkin'
});

// let instrumentation = new Instrumentation.HttpServer({tracer, port: 9411, serviceName: 'Arrigo dev-Zipkin'});

try {
    tracer.local('SomeTestMethod', () => app.SomeTestMethod());
} catch (err){
    tracer.local('ErrorFunction', () => app.error(err, err.message, tracer));
}

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('What do you think of Node.js? ', (answer) => {
  // TODO: Log the answer in a database
  console.log(`Thank you for your valuable feedback: ${answer}`);

  rl.close();
});