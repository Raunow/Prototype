import { json } from 'body-parser';
import { Request, Response, Router } from 'express';
import { readFile, unlink, writeFile } from 'fs';
import { join } from 'path';
import { RespondHTTP } from './response';

class SubscriptionController {
	private resolvePath = (account: string) => join(__dirname, '../..', `/accounts/${account}.json`);

	PUT({ params, body }: Request, res: Response) {
		body.account = params.account;
		writeFile(this.resolvePath(params.account), JSON.stringify(body, null, '\t'), (err) => {
			if (err) {
				console.log(err);
				RespondHTTP(res, 500, err.message);
			} else {

				RespondHTTP(res, 200, 'Subscription saved.');
			}
		})
	}

	GET({ params }: Request, res: Response) {
		readFile(this.resolvePath(params.account), (err, buffer) => {
			if (err) {
				console.log(err);
				RespondHTTP(res, 500, err.message);
			} else {
				RespondHTTP(res, 200, JSON.parse(buffer.toString()));
			}
		})
	}

	DELETE({ params }: Request, res: Response) {
		unlink(this.resolvePath(params.account), (err) => {
			if (err) {
				console.log(err);
				RespondHTTP(res, 500, err.message);
			} else {
				RespondHTTP(res, 200, 'Subscription removed');
			}
		})
	}
}


export function subscriptionRouter(...middlewares: Router[]) {
	let param = '/:account';
	let path = '/subscription' + param;
	let subscriber = new SubscriptionController;
	let router = Router();

	if (middlewares.length !== 0) router.use(middlewares);

	router.use(path, json())
	router.put(path, (req, res) => subscriber.PUT(req, res));
	router.get(path, (req, res) => subscriber.GET(req, res));
	router.delete(path, (req, res) => subscriber.DELETE(req, res));

	return router;
}