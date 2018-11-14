import { writeFile, write } from 'fs'

export class App {
	public subscribe() {
		var stackTrace = (new Error()).stack; // Only tested in latest FF and Chrome
		var callerName = stackTrace.replace(/^Error\s+/, ''); // Sanitize Chrome
		callerName = callerName.split("\n")[1]; // 1st item is this, 2nd item is caller
		callerName = callerName.replace(/^\s+at Object./, ''); // Sanitize Chrome
		callerName = callerName.replace(/ \(.+\)$/, ''); // Sanitize Chrome
		callerName = callerName.replace(/\@.+/, ''); // Sanitize Firefox

		this.Log(callerName)
		// 1st item is this, 2nd item is caller
	}

	public test() {
		this.subscribe();
	}

	public test1() {
		this.test();
	}

	public Log(log: any) {
		writeFile(`${__dirname}/test.txt`, log, (error) => {
			if (error) {
				console.error(error.stack);
				return;
			}
			console.log("File has been created");
		});
	}
}


try { throw new Error("test error string"); }
catch (e) {
	let app: App = new App();
	app.test1();
}