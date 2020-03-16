import cors from 'cors';
import Express from 'express';
import { createServer } from 'http';
import { subscriptionRouter } from './subscriptionRouter';



export async function createExpress(PORT: number) {
	let app = Express();

	app.use(cors());
	//app.use((req, _, next) => { console.log(req.path); next() });
	app.use(subscriptionRouter());

	return createServer(app).listen(PORT);
}
