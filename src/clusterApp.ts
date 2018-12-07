import { Span, Tags } from '@raunow/rs-opentrace';
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

	public error(err: Error, message: string, rootSpan: Span) {
		let span: Span = rootSpan.ChildSpan('Error Function');
		this.AssembleError(err, message || err.message, span)
		span.Finish();
	}

	public SomeTestMethod = (rootSpan: Span) => {
		let span: Span = rootSpan.ChildSpan('SomeTestMethod');
		span.Tag(Tags.ERROR, true);
		let err: Error = new Error();
		span.AddLogs({
			'event': "Error thrown",
			'value': `Stack: \n${err.stack}`
		});
		this.error(err, null, span);
		span.Finish();
	}
}

export const app: Cluster = new Cluster();