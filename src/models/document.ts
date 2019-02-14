import { DBColumn, Filterable } from "../libs/decorators";
import { IBase } from "./base";

@DBTable("Dokument")
class Document implements IBase {
  uid: string;

  @DBColumn("DID")
  @Filterable(typeof number) //TODO Request cap defined in resolver
  id: number;

  test: number;

  @DBColumn("Doknamn")
  name: string;

  @DBColumn("filnamn")
  filename: string;

  @DBColumn("DTID")
  documentTypeId: number;

  @DBColumn("StdDok")
  standardDoc: boolean;

  @DBColumn("GeneralDoc")
  generalDoc: number;
}

export { Document };
