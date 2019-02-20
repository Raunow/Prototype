import { Query, QueryType } from "../libs/Query";

export class IBase {
	uid: string; //What is used to query a specific row and table
	id: number; // Used as part of the uid
	name: string; //everything needs a name


	public Select(): Query {
		return new Query(Object.keys(this).reduce((sum, key) => this.Column(key) ? `${sum}\n  ${this.Column(key)} AS ${key},` : sum, "SELECT ") + `\n FROM ${this.Table()}`,
			QueryType.Read);
	}

	public Update(): Query {
		return new Query(Object.keys(this).reduce((sum, key) => this.Column(key) ? `${sum}\n  ${this.Column(key)} = @${key},` : sum, `UPDATE ${this.Table()} SET`),
			QueryType.Update)
	}

	//Debug
	public DBTable = () => 'DB Table:\n' + `${this.Table()}${Object.keys(this).reduce((sum, key) => this.Column(key) ? `${sum}\n ${key} = ${this.Column(key)}` : sum, '')}`;

	//Reduce redundancy
	private Table = () => this[`DBTable`];
	private Column = (key: string) => this[`${key}DBColumn`];
 
	static Create = (obj, template) => {
    const o = {};
    Object.assign(o, obj);
    Object.setPrototypeOf(o, template);
    return o;
  }
}