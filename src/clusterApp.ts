import { ExplicitContext, Tracer, Annotation } from 'zipkin'
import { LogOut } from './libs/logger';

export class Cluster {

	private AssembleError(error: Error, msg: string, rootSpan: Span) {
		let span: Span = rootSpan.ChildSpan('Assemble Error Function');
		let trace: Array<string> = error.stack.replace(/^Error\s+/, '').split("\n");
		let done: Array<string> = new Array<string>();

		trace.forEach(function (caller: string) {
			let src: string = caller.split("\\").pop().replace(/\s*?at .*? \(/, '');
			let match = caller.match(/at (.*?) /);
			
			if (match)
			{
				caller = match[1];
				done.push(caller + " (" + src);
			}
		})

		LogOut(done.join("\n"), span);
	}

	public error(err: Error, message: string) {
		let span: Span = rootSpan.ChildSpan('Error Function');
		this.AssembleError(err, message || err.message, span)
		span.Finish();
	}

	public SomeTestMethod = (tracer: Tracer) => {
		tracer.recordBinary('error', true);
		let err: Error = new Error();

		tracer.recordAnnotation()
		span.AddLogs({
			'event': "Error thrown",
			'value': `Stack: \n${err.stack}`
		});
		tracer.local('error func', () => this.error(err, null))
	}
}

export const app: Cluster = new Cluster();