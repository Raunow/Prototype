import { app } from './clusterApp';
import { Span } from '@raunow/rs-opentrace';

let rootSpan: Span = new Span('RootSpan');

app.SomeTestMethod(rootSpan);

rootSpan.Finish();
rootSpan.Tracer.Close();