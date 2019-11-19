import { Response } from 'express';

export function RespondHTTP(res: Response, status: number, payload: any) {
	res.contentType('application/json');
	res.status(status);
	res.end(JSON.stringify(payload));
}