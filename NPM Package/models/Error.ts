import { Syslog } from "./Syslog";
import { Trace } from "./Trace";

export interface Error extends Syslog, Trace {
	Syslog: Syslog,
	Trace: Trace
}