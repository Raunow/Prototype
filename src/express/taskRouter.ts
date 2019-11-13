import { json } from 'body-parser';
import { Request, Response, Router } from 'express';
import { readFile, unlink, writeFile } from 'fs';
import { join } from 'path';
import { startWorker } from '../TaskRunner/TaskRunner';
import { RespondHTTP } from './response';

class TaskController {
	private resolvePath = (filename: string) => join(__dirname, '../..', `/tasks/${filename}.js`);

	PUT({ params, body }: Request, res: Response) {
		writeFile(this.resolvePath(params.name), body.task, (err) => {
			if (err) {
				console.log(err);
				RespondHTTP(res, 500, err);
			} else {
				RespondHTTP(res, 200, params.name + ' created');
			}
		});
	}

	GET({ params }: Request, res: Response) {
		readFile(this.resolvePath(params.name), (err, data) => {
			if (err) {
				console.log(err);
				RespondHTTP(res, 500, err);
			} else {
				RespondHTTP(res, 200, data.toString());
			}
		});
	}

	POST({ params, body }: Request, res: Response) {
		startWorker(params.name, body).then((result) => {
			RespondHTTP(res, 200, result);
		}, (err) => {
			console.log(err);
			let resp;
			if (err.Error) {
				err.Error = err.Error.toString();
			}
			RespondHTTP(res, 200, err);
		});
	}

	DELETE({ params }: Request, res: Response) {
		unlink(this.resolvePath(params.name), (err) => {
			if (err) {
				console.log(err);
				RespondHTTP(res, 500, 'Error: Task not present.');
			} else {
				RespondHTTP(res, 200, params.name + ' deleted');
			}
		});
	}
}


export function taskRouter(...middlewares: Router[]) {
	let param = '/:name';
	let path = '/task' + param;
	let task = new TaskController;
	let router = Router();

	if (middlewares.length !== 0) router.use(middlewares);

	router.use(path, json())
	router.put(path, (req, res) => task.PUT(req, res));
	router.get(path, (req, res) => task.GET(req, res));
	router.post(path, (req, res) => task.POST(req, res));
	router.delete(path, (req, res) => task.DELETE(req, res));

	return router;
}