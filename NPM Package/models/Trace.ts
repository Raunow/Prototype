import { Exceptions } from "./Exceptions";

export interface Trace {
	Parent: string,
	Errors: Array<Exceptions>
}