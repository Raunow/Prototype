import { ClusterLogger} from 'logging'

const LoginLogger = new ClusterLogger("Login")

LoginLogger.log("a message")

{
	id: 4567
	timestamp: "today"
	eventSource:"Server3.Login"
	payload: "a message"
}


const sublogger = LoginLogger.CreateLogger("SubLogger")

sublogger.log(" a message")


