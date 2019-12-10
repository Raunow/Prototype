import { promises } from "fs";
import { join } from "path";
import { promisify } from 'util'
import { IAccount, IApplication, IBlock, IError, IInput } from "./interfaces";

const resolvePath = (file: string, folder: string) => join(__dirname, '../..', `/config/${folder}/${file}.json`);
const templatePath = (file: string) => resolvePath(file, 'templates');
const accountPath = (file: string) => resolvePath(file, 'accounts');

export class Account implements IAccount {
	topic: string;
	args: { [key: string]: any }
	applications: { [key: string]: Application } = {};

	constructor(public name: string) { };

	async init() {
		let { topic, args, applications } = JSON.parse((await promises.readFile(accountPath(this.name))).toString()) as IAccount;
		this.args = args;
		this.topic = topic;

		await Object.entries(applications).forEach(async ([name, app]) => {
			this.applications[name] = new Application(app, this.args);
			await this.applications[name].init();
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

		this.block = new Block();
	}

	async init() {
		await this.block.init(this.name)
	}
}

export class Block implements IBlock {
	name: string;
	inputs?: { [key: string]: IInput };
	block: Block;
	children?: { [key: string]: IBlock & Block } = {};
	output?: Array<string>;
	error?: IError;

	constructor() { }

	async init(blockName: string) {
		let data = await promises.readFile(templatePath(blockName));
		Object.assign(this, JSON.parse(data.toString()) as IBlock & Block);

		if (this.name && this.name !== blockName) {
			this.block = new Block();
			await this.block.init(this.name);
		}

		if (this.children) {
			await Object.entries(this.children).forEach(async ([key, child]) => {
				if (child.name && child.name !== key) {
					child.block = new Block();
					await child.block.init(child.name);
				}
			});
		}
	}
}
