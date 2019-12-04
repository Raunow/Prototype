import { readFile } from "fs";
import { join } from "path";

const resolvePath = (template: string) => join(__dirname, '../..', `/config/templates/${template}.json`);

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


export class Account {
	topic: string;
	apps: { [key: string]: Application };

	constructor(public name: string, accountJSON: string) {
		let { topic, apps } = JSON.parse(accountJSON) as IAccount;
		this.topic = topic;

		Object.entries(apps).forEach(([name, app]) => this.apps[name] = new Application(app));
	}
}

export class Application {
	name: string;
	user: string;
	args?: { [key: string]: any };
	blocks: Array<Block>;
	triggers: Array<Block>;

	constructor({ name, user, args }: IApplication) {
		this.name = name;
		this.user = user;
		this.args = args;

		this.initBlocks();
	}

	initBlocks() {
		readFile(resolvePath(this.name), (err, data) => {

		})
	}
}

export class Block {

	constructor(name: string) {
		readFile(resolvePath(name), (err, data) => {
			if (err) {
				console.log(err);
			}

			JSON.parse(data.toString());

		});
	}
}