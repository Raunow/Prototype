import { Base } from "./Base";

export interface Error extends Base {
	Stack: Array<string>
}