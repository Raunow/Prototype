import bodyparser from 'body-parser';
import cors from 'cors';
import Express, { Request, Response } from 'express';
import { readFile, rmdir, writeFile } from 'fs';
import { createServer } from 'http';


export async function createExpress(PORT: number) {
	let app = Express();

	app.use(cors());
	//app.use((req, _, next) => { console.log(req.path); next() })

	app.post('/task', bodyparser.json(), (req: Request, res: Response) => {
		let task = req.body.task;

		// do something.


		res.contentType('application/json');
		res.status(200);
		res.end(JSON.stringify(task));
	});

	app.get('/task/:name', bodyparser.json(), (req: Request, res: Response) => {
		let content = readFile(`./tasks/${req.params.name}.mjs`, (err) => {
			if (err) {
				res.contentType('application/json');
				res.status(500);
				res.end(JSON.stringify(err));
				return;
			}
		});
		res.contentType('application/json');
		res.status(200);
		res.end(JSON.stringify(content));
	});

	app.put('/task/:name', bodyparser.json(), (req: Request, res: Response) => {
		writeFile(`./tasks/${req.params.name}.mjs`, req.body.task, (err) => {
			if (err) {
				res.contentType('application/json');
				res.status(500);
				res.end(JSON.stringify(err));
				return;
			}
		});

		res.contentType('application/json');
		res.status(200);
		res.end(JSON.stringify(req.body.name + ' created'));
	});

	app.delete('/task/:name', bodyparser.json(), (req: Request, res: Response) => {
		rmdir(`./tasks/${req.params.name}.mjs`, (err) => {
			if (err) {
				res.contentType('application/json');
				res.status(500);
				res.end(JSON.stringify(err));
				return;
			}
		});

		res.contentType('application/json');
		res.status(200);
		res.end(JSON.stringify(req.body.name + ' deleted'));
	});

	return createServer(app).listen(PORT);
}
