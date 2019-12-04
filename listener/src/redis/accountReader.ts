import { readFile } from "fs";
import { join } from "path";

const resolvePath = (file: string, folder: string) => join(__dirname, '../..', `/config/${folder}/${file}.json`);
const templatePath = (file: string) => resolvePath(file, 'templates');
const accountPath = (file: string) => resolvePath(file, 'accounts');

interface IAccount {
	topic: string;
	apps: { [key: string]: IApplication };
}
interface IApplication {
	name: string;
	user: string;
	args?: { [key: string]: any };
	error: "all" | "silent" | Array<string>;
}
interface IBlock {
	name: string;
	title: string;
	inputs: { [key: string]: any };
	children: { [key: string]: Block };
}


export class Account implements IAccount {
	topic: string;
	apps: { [key: string]: Application };

	constructor(public name: string) {
		readFile(accountPath(this.name), (err, data) => {
			if (err) console.error(err);

			let { topic, apps } = JSON.parse(data.toString()) as IAccount;
			this.topic = topic;

			Object.entries(apps).forEach(([name, app]) => this.apps[name] = new Application(app));
		});
	}
}

export class Application implements IApplication {
	name: string;
	user: string;
	args?: { [key: string]: any };
	error: "all" | "silent" | Array<string>;
	blocks: Array<Block>;
	triggers: Array<Block>;

	constructor(app: IApplication) {
		Object.assign(this, app)

		this.initBlocks(this.name);
	}

	initBlocks(name: string) {
		let block = new Block(name);


	}
}

export class Block {
	children: Array<Block>;
	constructor(name: string) {
		readFile(templatePath(name), (err, data) => {
			if (err) console.error(err);

			JSON.parse(data.toString());
		});
	}
}