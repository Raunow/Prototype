export interface IAccount {
	topic: string;
	args?: { [key: string]: any };
	applications?: { [key: string]: IApplication };
}
export interface IApplication {
	name: string;
	user: string;
	args?: { [key: string]: any };
	inputs?: { [key: string]: IInput }
	children?: { [key: string]: IBlock };
	error?: IError;
}
export interface IBlock {
	name: string;
	inputs?: { [key: string]: IInput };
	children?: { [key: string]: IBlock };
	output?: Array<string>;
	error?: IError;
}
export interface IInput {
	topics?: Array<string>;
	title?: string;
	value?: any;
	writeable?: boolean;
	connectable?: boolean;
}

export type IError = "all" | "silent" | Array<string>;