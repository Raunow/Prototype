import { IBase } from "../models/base";

/*
//Debug
export function ColumnNames(o: IBase) {
	return Object.keys(o).reduce((sum, key) => Object.getPrototypeOf(o)[`${key}DBColumn`] ? `${sum}\n ${key} = ${Object.getPrototypeOf(o)[`${key}DBColumn`]}` : sum);
}

// SQL 'SELECT Query' generator
export function SelectQuery(o: IBase): string {
	let query = Object.keys(o).reduce((sum, key) => o[`${key}DBColumn`] ? `${sum}\n  ${o[`${key}DBColumn`]} AS ${key},` : sum, "SELECT ");

	return `${query.substring(0, query.length - 1)} \n FROM ${o['DBTable']}`;
}

export function Update(o: IBase): string {
	
	Object.keys(o).reduce((sum, key) => o[`${key}DBColumn`] ? `${sum}\n  ${o[`${key}DBColumn`]} = @${key}` : sum, `UPDATE ${o['DBTable']} SET\n`)
	
	return ``;
}*/