import { ISyslog } from "./Syslog";
import { IError } from "./Error";
import { IInfo } from "./info";

export interface IPayload {
	Syslog: ISyslog,
	Errors: Array<IError>,
	Logs: Array<IInfo>
}