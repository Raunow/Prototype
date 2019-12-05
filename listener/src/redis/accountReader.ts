import { readFile } from "fs";
import { join } from "path";
import { IAccount, IApplication, IBlock, IError, IInput } from "./interfaces";

const resolvePath = (file: string, folder: string) => join(__dirname, '../..', `/config/${folder}/${file}.json`);
const templatePath = (file: string) => resolvePath(file, 'templates');
const accountPath = (file: string) => resolvePath(file, 'accounts');



//TODO: use args before parsing to objects. and pass the args down the chain.
export class Account implements IAccount {
	topic: string;
	args: { [key: string]: any }
	apps: { [key: string]: Application };

	constructor(public name: string) {
		readFile(accountPath(this.name), (err, data) => {
			if (err) console.error(err);

			let { topic, args, apps } = JSON.parse(data.toString()) as IAccount;
			this.args = args;
			this.topic = topic;

			Object.entries(apps).forEach(([name, app]) => this.apps[name] = new Application(app));
		});
	}
}

//TODO: Merge args and check for macros in text before parsing.
export class Application implements IApplication {
	name: string;
	user: string;
	args?: { [key: string]: any };
	inputs?: { [key: string]: IInput }
	error?: IError;
	block: Block;

	constructor(app: IApplication) {
		Object.assign(this, app)

		this.block = new Block(this.name);
	}
}

export class Block implements IBlock {
	name: string;
	inputs?: { [key: string]: IInput };
	children?: { [key: string]: IBlock };
	output?: Array<string>;
	error: IError;

	constructor(name: string) {
		readFile(templatePath(name), (err, data) => {
			if (err) console.error(err);

			JSON.parse(data.toString());
		});
	}
}