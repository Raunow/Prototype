import { app } from './clusterApp';
import { Tracer, Span } from './OpenTracing/index';

let rootSpan: Span = Tracer.StartSpan('RootSpan');

app.SomeTestMethod(rootSpan);

rootSpan.Finish();
Tracer.Close();