import { Syslog } from "./Syslog";
import { Error } from "./Error";
import { Logs } from "./Logs";

export interface IPayload {
	Syslog: Syslog,
	Errors: Array<Error>,
	Logs: Array<Logs>
}