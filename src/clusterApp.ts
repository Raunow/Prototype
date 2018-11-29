import { Span, Tags } from './OpenTracing/index';
import { LogOut } from './libs/logger';

export class Cluster {

	private AssembleError(error: Error, msg: string, rootSpan: Span) {
		let span: Span = rootSpan.Tracer().StartSpan('Assemble Error Function', rootSpan);
		let trace: Array<string> = error.stack.replace(/^Error\s+/, '').split("\n");

		for (let i = 0; i < 8; i++) { trace.pop(); }
		span.Log({ "trace": trace });
		let done: Array<string> = new Array<string>();

		trace.forEach(function (caller: string) {
			let temp: string = caller.split("\\").pop();
			caller = caller.replace(/at /, '').replace(/\@.+/, '');
			caller = caller.replace(/ \(.+\)/, '');

			done.push(caller + " (" + temp);
		});
		span.Log({ "Output": done });
		LogOut(done.join("\n"), span);
		span.Finish();
	}

	public error(err: Error, message: string, rootSpan: Span) {
		let span: Span = rootSpan.Tracer().StartSpan('Error Function', rootSpan);
		this.AssembleError(err, message || err.message, span)
		span.Finish();
	}

	public SomeTestMethod = (rootSpan: Span) => {
		let span: Span = rootSpan.Tracer().StartSpan('SomeTestMethod', rootSpan);
		span.SetTag(Tags.ERROR, true);
		let err: Error = new Error();
		span.Log({
			'event': "Error thrown",
			'value': `Stack: \n${err.stack}`
		});
		this.error(err, null, span);
		span.Finish();
	}
}

export const app: Cluster = new Cluster();