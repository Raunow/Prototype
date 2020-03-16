import { promises } from "fs";
import { join } from "path";
import { IAccount, IApplication, IBlock, IError, IInput } from "./interfaces";


//topic: Account/Application/Block
//       Account/Application/Block/Block

const times = ['month', 'week', 'day', 'hour', 'minute'];

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
			this.applications[name] = new Application(app, this.args, this.topic);
			return this.applications[name].init();
		}));
	}

	configure() {
		Object.values(this.applications).forEach(app => app.configure());
	}

	parse() {

	}
}


export class Application implements IApplication {
	name: string;
	topic: string;
	user: string;
	args?: { [key: string]: any };
	inputs?: { [key: string]: IInput }
	error?: IError;
	block: Block;

	constructor({ name, user, args, inputs, error }: IApplication, rootArgs: { [key: string]: any } = {}, accTopic: string) {
		this.name = name;
		this.topic = accTopic + '/' + name;
		this.user = user;
		this.args = Object.assign({}, rootArgs, args);
		this.inputs = inputs || {};
		this.error = error || 'all';
		this.block = new Block();
	}

	async init() {
		let argColl = Object.entries(this.args);
		await this.block.init(this.name, argColl);
	}

	configure() {
		this.block.configure(this);
		this._genericConfigure(this);
	}

	_genericConfigure(parent: Application | Block) {
		if (parent.block.children) {
			Object.values(parent.block.children).forEach(child => child.block.configure(parent));
			Object.values(parent.block.children).forEach(child => this._genericConfigure(child))
		}
	}

	parse() {

	}
}


export class Block implements IBlock {
	name: string;
	topic: string;
	inputs?: { [key: string]: IInput };
	block: Block;
	children?: { [key: string]: IBlock & Block };
	output?: Array<string>;
	error?: IError;

	async init(blockName: string, args: Array<[string, any]>) {
		let rawBlock = (await promises.readFile(templatePath(blockName))).toString();
		rawBlock = args.reduce((text, entry) => text.replace(`%${entry[0]}%`, entry[1]), rawBlock);

		Object.assign(this, JSON.parse(rawBlock) as IBlock & Block);

		this.children && await Promise.all(
			Object.entries(this.children)
				.map(([key, child]) => {
					if (child.name && child.name !== key) {
						child.block = new Block();
						return child.block.init(child.name, args);
					}
				}));
	}

	configure(config: Application | Block) {
		Object.keys(this.inputs).forEach((key) => {
			if (config.inputs[key]) {
				Object.assign(this.inputs[key], config.inputs[key]); //If input of parent and child are equal

			} else if (this.inputs[key].topics) {
				this.inputs[key].topics.forEach((topic, index) => {
					if (times.includes(topic)) return; //Time triggers

					if (topic.startsWith('./')) { //Relative inputs
						topic = topic.slice(2);
						if (config.block.inputs[topic]) {
							this.inputs[key].topics = config.inputs[topic].topics;

						} else if (config.block.children && config.block.children[topic]) {

							config.topic || console.log(config)
							this.inputs[key].topics[index] = config.topic + '/' + topic;
						}
					}
				});
			}
		});

		this.children && Object.values(this.children).forEach((child) => child.block.configure(child));
	}

	parse() {

	}
}
