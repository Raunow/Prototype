import { json } from 'body-parser';
import { Request, Response, Router } from 'express';
import { readFile, unlink, writeFile } from 'fs';
import { join } from 'path';
import { workerPool } from '../index';
import { RespondHTTP } from './response';

class TaskController {
	private resolvePath = (filename: string) => join(__dirname, '../..', `/tasks/${filename}.json`);

	PUT({ params, body }: Request, res: Response) {
		body.name = params.name;
		writeFile(this.resolvePath(params.name), JSON.stringify(body, null, '\t'), (err) => {
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
				RespondHTTP(res, 200, JSON.parse(data.toString()));
			}
		});
	}

	POST({ params, body }: Request, res: Response) {
		workerPool.run(() => ({
			filename: params.name,
			context: body.context || {}
		}),
			(err, result) => {
				if (err) {
					console.log(err);
					RespondHTTP(res, 500, err.message);
				} else {
					if (result.error) {
						result.error = `${result.error.name}: ${result.error.message}`
					}
					RespondHTTP(res, 200, result);
				}
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