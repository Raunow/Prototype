import { json } from 'body-parser';
import { Request, Response, Router } from 'express';
import { join } from 'path';

class SubscriptionController {
	private resolvePath = (account: string) => join(__dirname, '../..', `/accounts/${account}.json`);

	PUT({ params, body }: Request, res: Response) {

	}

	GET({ params }: Request, res: Response) {

	}

	DELETE({ params }: Request, res: Response) {

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