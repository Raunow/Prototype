import { IBase } from "./Base";

export interface IError extends IBase {
	Stack: Array<string>
}