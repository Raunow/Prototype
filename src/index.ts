import { app } from './clusterApp';
import { Tracer, Span } from '@raunow/rs-opentrace';

let rootSpan: Span = Tracer.StartSpan('RootSpan');

app.SomeTestMethod(rootSpan);

rootSpan.Finish();
Tracer.Close();