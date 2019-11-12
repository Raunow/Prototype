import cors from 'cors';
import Express from 'express';
import { createServer } from 'http';
import { taskRouter } from './taskRouter';



export async function createExpress(PORT: number) {
	let app = Express();

	app.use(cors());
	//app.use((req, _, next) => { console.log(req.path); next() });
	app.use(taskRouter());

	return createServer(app).listen(PORT);
}
