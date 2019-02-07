import { Tracer } from 'zipkin'
import { LogOut } from './libs/logger';

export class Cluster {

	private AssembleError(error: Error, msg: string, tracer: Tracer) {
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

		tracer.local('LogOut', () => LogOut(done.join("\n"), tracer));
	}

	public error(err: Error, message: string, tracer: Tracer) {
		tracer.local('Assemble Error', () => 
			this.AssembleError(err, message || err.message, tracer));
	}

	public SomeTestMethod = () => { throw new Error(); }
}

export const app: Cluster = new Cluster();