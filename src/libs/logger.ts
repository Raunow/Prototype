import { writeFile } from "fs";
import { Tracer } from "zipkin";

export function LogOut(log: any, tracer: Tracer): any {
	tracer.local('WriteFile', () => writeFile(`${__dirname}/test.txt`, log, error => {
		if (error) {
			return;
		}
		console.log('File created');
		tracer.recordBinary('File created', true);
	}));
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
	});

	return done.join("\n");
}