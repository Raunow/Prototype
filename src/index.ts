import { app } from './clusterApp';
import { Tracer, ExplicitContext , jsonEncoder, BatchRecorder, Instrumentation } from 'zipkin';
import { HttpLogger } from 'zipkin-transport-http';

let ctx: ExplicitContext = new ExplicitContext();

let tracer: Tracer = new Tracer({
    ctxImpl: ctx,
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