import { promises } from "fs";
import { join } from "path";
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
		let rawAccount = (await promises.readFile(accountPath(this.name))).toString();
		let { topic, args, applications } = JSON.parse(rawAccount) as IAccount;
		this.args = args;
		this.topic = topic;

		await Promise.all(Object.entries(applications).map(([name, app]) => {
			this.applications[name] = new Application(app, this.args);
			return this.applications[name].init();
		}));
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
		let argColl = Object.entries(this.args);
		await this.block.init(this.name, argColl);
		this.configure();
	}

	configure() {
		this.block.configure(this);
	}
}


export class Block implements IBlock {
	name: string;
	inputs?: { [key: string]: IInput };
	block: Block;
	children?: { [key: string]: IBlock & Block };
	output?: Array<string>;
	error?: IError;

	async init(blockName: string, args: Array<[string, any]>) {
		let rawBlock = (await promises.readFile(templatePath(blockName))).toString();
		rawBlock = args.reduce((text, entry) => text.replace(`%${entry[0]}%`, entry[1]), rawBlock);

		Object.assign(this, JSON.parse(rawBlock) as IBlock & Block);

		if (this.children) {
			await Promise.all(
				Object.entries(this.children)
					.map(([key, child]) => {
						if (child.name && child.name !== key) {
							child.block = new Block();
							return child.block.init(child.name, args);
						}
					})
			);
		}
	}
	configure(config) {
		const inputsConfig = config.inputs;
		Object.keys(this.inputs).forEach((key) => {
			const inputConfig = inputsConfig[key];
			Object.assign(this.inputs[key], inputConfig);
		})
		if (this.children) {
			Object.entries(this.children)
				.map(([key, child]) => {
					child.block.configure(child)
				})

		}
	}
}
