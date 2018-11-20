import { writeFile } from 'fs'
import { Tracer, Tags, Span} from 'opentracing';

/*
const logFile = new logFile(['Logger', 'sublogger']);
logFile.log(message)


setTimeout(() => {
	let logFileToSend = logFile;
	logFile = new logFile();
	SendLogFile(logFileToSend)
})*/

const tracer: Tracer = new Tracer();
const bigSpan: Span = tracer.startSpan('test');
bigSpan.setTag(Tags.COMPONENT, false);
bigSpan.log({'event': 'test'});
bigSpan.finish();

export class Cluster {

	private AssembleError(error: Error, msg: string) {
		let trace: Array<string> = error.stack.replace(/^Error\s+/, '').split("\n");
		
		for (let i = 0; i < 8; i++) {
			trace.pop();
		}
		let done: Array<string> = new Array<string>();

		trace.forEach(function (caller: string) {
			let temp: string = caller.split("\\").pop();
			caller = caller.replace(/at /, '').replace(/\@.+/, '');
			caller = caller.replace(/ \(.+\)/, '');

			done.push(caller + " (" + temp);
		});
		
		LogOut(done.join("\n"));
	}

	private AssembleInfo(error: string, msg: string) {
	}

	public error(err: Error, message: string = undefined) {
		this.AssembleError(err, message || err.message)
	}

	public info(message) {
		let logstack = (new Error()).stack;
		this.AssembleInfo(logstack, message)
	}

	public SomeTestMethod = () => {
		let err: Error = new Error();
		let span: Span = tracer.startSpan('Logging', {childOf: bigSpan})
		span.setTag(Tags.ERROR, true);
		span.log({'event': 'error', 'error.object': err, 'message': err.message, 'stack': err.stack}, new Date().getTime());
		span.finish(new Date().getTime());
		LogOut(JSON.stringify(span));
	}
}

function LogOut(log: any) {
	writeFile(`${__dirname}/test.json`, log, error => {
		if (error) {
			console.error(error.stack);
			return;
		}
		console.log("File created");
	});
};

let app: Cluster = new Cluster();
app.SomeTestMethod();
