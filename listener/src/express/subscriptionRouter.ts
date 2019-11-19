import { json } from 'body-parser';
import { Request, Response, Router } from 'express';
import { readFile, unlink, writeFile } from 'fs';
import { join } from 'path';
import { RespondHTTP } from './response';

class SubscriptionController {
	private resolvePath = (filename: string) => join(__dirname, '../..', `/accounts/${filename}.json`);

	PUT({ params, body }: Request, res: Response) {
		writeFile(this.resolvePath(params.name), JSON.stringify({
			name: params.name,
			task: body.task,
			imports: body.imports || []
		}), (err) => {
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
					RespondHTTP(res, 500, 'Error: Task not present.');
				} else {
					if (result.error) {
						console.log(result)
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


export function subscriptionRouter(...middlewares: Router[]) {
	let param = '/:account';
	let path = '/subscription';
	let subscriber = new SubscriptionController;
	let router = Router();

	if (middlewares.length !== 0) router.use(middlewares);

	router.use(path, json())
	router.put(path, (req, res) => subscriber.PUT(req, res));
	router.get(path, (req, res) => subscriber.GET(req, res));
	router.post(path, (req, res) => subscriber.POST(req, res));
	router.delete(path, (req, res) => subscriber.DELETE(req, res));

	return router;
}