import { writeFile } from "fs";
import { Span, Tags} from '../OpenTracing/index'

export function LogOut(log: any, rootSpan: Span): any {
	let span: Span = rootSpan.Tracer().StartSpan('LogOut', rootSpan);
	writeFile(`${__dirname}/test.txt`, log, error => {
		if (error) {
			span.SetTag(Tags.ERROR, true);
			span.Log({
				'event': "Error thrown",
				'value': `Error: ${error.name}, Message: ${error.message}, Stack: ${error.stack}`
			});
			return;
		}
		console.log('File created');
		span.SetTag('File created', true);
	});

	span.Finish();
};
