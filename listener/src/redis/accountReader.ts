import { readFile } from "fs";
import { join } from "path";
import { IAccount, IApplication, IBlock, IError, IInput } from "./interfaces";

const resolvePath = (file: string, folder: string) => join(__dirname, '../..', `/config/${folder}/${file}.json`);
const templatePath = (file: string) => resolvePath(file, 'templates');
const accountPath = (file: string) => resolvePath(file, 'accounts');



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

			Object.entries(apps).forEach(([name, app]) => this.apps[name] = new Application(app, this.args));
		});
	}
}

//TODO: check for macros in text before parsing.
export class Application implements IApplication {
	name: string;
	user: string;
	args?: { [key: string]: any };
	inputs?: { [key: string]: IInput }
	error?: IError;
	block: Block;

	constructor({ name, user, args, inputs, error }: IApplication, rootArgs: { [key: string]: any } = {}) {
		this.name = name;
		this.user = user;
		this.args = Object.assign({}, rootArgs, args);
		this.inputs = inputs || {};
		this.error = error || 'all';

		this.block = new Block(this.name);
	}
}

export class Block implements IBlock {
	name: string;
	inputs?: { [key: string]: IInput };
	block: Block;
	children?: { [key: string]: IBlock & Block };
	output?: Array<string>;
	error?: IError;

	constructor(name: string) {
		readFile(templatePath(name), (err, data) => {
			if (err) console.error(err);

			let { name, inputs, children, output, error } = JSON.parse(data.toString()) as IBlock & Block;
			this.name = name
			this.inputs = inputs;
			this.output = output;
			this.error = error;
			this.children = children;

			if (this.name) {
				this.block = new Block(this.name);
			}

			Object.keys(children).forEach(key => {
				if (children[key].name) {
					children[key].block = new Block(children[key].name);
				}
			});
		});
	}
}