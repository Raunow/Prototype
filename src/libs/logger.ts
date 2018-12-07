import { writeFile } from "fs";
import { Span, Tags} from '@raunow/rs-opentrace'

export function LogOut(log: any, rootSpan: Span): any {
	let span: Span = rootSpan.ChildSpan('LogOut');
	writeFile(`${__dirname}/test.txt`, log, error => {
		if (error) {
			span.Tag(Tags.ERROR, true);
			span.AddLogs({
				'event': "Error thrown",
				'value': `Error: ${error.name}, Message: ${error.message}, Stack: ${error.stack}`
			});
			return;
		}
		console.log('File created');
		span.Tag('File created', true);
	});

	span.Finish();
};

export const TrimStackTrace = (error: string | Error) => {
	let trace: Array<string>;
	let done: Array<string> = new Array<string>();

	if (typeof error === typeof Error){
		trace = (error as Error).stack.replace(/^Error\s+/, '').split("\n");
	}
	else
		trace = (error as string).replace(/^Error\s+/, '').split("\n");

	trace.forEach(function (caller: string) {
		let src: string = caller.split("\\").pop().replace(/\s*?at .*? \(/, '');
		let match = caller.match(/at (.*?) /);

		if (match) {
			caller = match[1];
			done.push(caller + " (" + src);
		}
	})

	return done.join("\n");
}