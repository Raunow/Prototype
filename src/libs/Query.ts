import { isString } from "util";

export class Query {
	private _query;
	private _queryType;

	get QueryType() { return this._queryType; }
	set QueryType(type: QueryType) { this._queryType = type; }
	get Query() { return this._query; }

	constructor(query: string, queryType?: QueryType) {
		this._query = query;
		this._queryType = queryType;
	}


	public Where() {
		return `WHERE `;
	}

	public InnerJoin(): string {
		return `INNER JOIN `;
	}
}

export enum QueryType {
	Create,
	Read,
	Update,
	Delete
}
