import {DBColumn} from '../libs/decorators';
import {IBase} from './base';

export class Document implements IBase {
	constructor(input: any) {
		Object.keys(input).map(key => this[key] = input[key]);
	}
	
	uid: string;

	@DBColumn('DID')
	id: number;

	@DBColumn('Doknamn')
	name: string;

	@DBColumn('filnamn')
	filename: string;

	@DBColumn('DTID')
	documentTypeId: number;

	@DBColumn('StdDok')
	standardDoc: boolean;

	@DBColumn('GeneralDoc')
	generalDoc: number;
}
