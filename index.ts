import { writeFile } from 'fs'

/*
const logFile = new logFile(['Logger', 'sublogger']);
logFile.log(message)


setTimeout(() => {
	let logFileToSend = logFile;
	logFile = new logFile();
	SendLogFile(logFileToSend)
})*/

export class Cluster {

	private AssembleError(error: Error, msg: string) {
		let trace: Array<string> = error.stack.replace(/^Error\s+/, '').split("\n"); // Only tested in latest FF and Chrome
		
		for (let i = 0; i < 6; i++) {
			trace.pop();
		}
		trace.map((caller) => {
			let temp: string = caller.split("\\").pop();
			caller = caller.replace(/at /, '').replace(/\@.+/, '');
			caller = caller.replace(/ \(.+\)/, '');
			//caller = caller
		})
		
		/*let done: Array<string> = new Array<string>();

		trace.forEach(function (caller: string) {
			let temp: string = caller.split("\\").pop();
			caller = caller.replace(/at /, '').replace(/\@.+/, '');
			caller = caller.replace(/ \(.+\)/, '');
			//caller = caller

			done.push(caller + " (" + temp); //Display the first and the rest are hidden;
		});*/

		
		LogOut(trace.join("\n")/* + "\n\n" + done.join("\n")*/);

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
		try {
			this.info('try to devide by zero')
			let temp = 1 / 0;
		}
		catch (err) {
			this.error(err);
		}
	}
}

function LogOut(log: string) {
	writeFile(`${__dirname}/test.txt`, log, (error) => {
		if (error) {
			console.error(error.stack);
			return;
		}
		console.log("File created");
	});
};

let app: Cluster = new Cluster();
app.SomeTestMethod();