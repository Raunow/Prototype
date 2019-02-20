import { DBColumn, Filterable, DBTable, TextFilter, OrderBy, RangeFilter, Eval } from "../libs/decorators";
import { IBase } from './base';

@DBTable("Dokument")
export class Document extends IBase {
  @DBColumn("DID")
  @Filterable(typeof Number) //TODO Request cap/amount-limit defined in resolver
  id: number;

  test: number;

  @NonField
  @FKInnerJoim("DTID", "DokumentTyp", "DTNamn")
  @Filterable(typeof String)
  @TextFilter
  @OrderBy
  documentName:string;

  @DBColumn("Doknamn")
  @Filterable(typeof String)
  @TextFilter
  @OrderBy
  @Eval(typeof String, 255)
  name: string;

  @DBColumn("filnamn")
  @TextFilter
  filename: string;

  @DBColumn('created') //TODO Doesn't exist
  @RangeFilter //Only one per model
  @OrderBy
  created: Date;
  
  @DBColumn("DTID")
  documentTypeId: number;


  @DBColumn("StdDok")
  @Filterable(typeof Boolean) //WHERE Clause
  @OrderBy //ORDERBY Clause
  standardDoc: boolean;

  @DBColumn("GeneralDoc")
  @Filterable(typeof String)
  generalDoc: number;


  static Create(obj){
    return library.Create(obj, _DocumentTemplate)
  }
}

const _DocumentTemplate = new Document();
