import { DBColumn, Filterable, DBTable, CopyTo } from "../libs/decorators";
import { IBase } from './base';

@DBTable("Dokument")
export class Document extends IBase {
  @DBColumn("DID")
  @Filterable(typeof Number) //TODO Request cap/amount-limit defined in resolver
  id: number;

  test: number;

  @DBColumn("Doknamn")
  @Filterable(typeof String)
  name: string;

  @DBColumn("filnamn")
  @Filterable(typeof Date)
  filename: string;

  @DBColumn("DTID")
  documentTypeId: number;

  @DBColumn("StdDok")
  standardDoc: boolean;

  @DBColumn("GeneralDoc")
  generalDoc: number;
}
