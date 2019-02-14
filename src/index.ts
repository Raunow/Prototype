//import { Building } from './models/building';
import { Document } from "./models/document";
import { IBase } from "./models/base";

// We have to change the result of queries from
// "result as T" -> result = new T(queryResult)
let document = {
  uid: "dhiNXWAjdfwenfåOXZNDaWdnwSDobfui",
  id: 10,
  name: "nope",
  filename: "steff",
  test: 2,
  documentTypeId: 1,
  standardDoc: true,
  generalDoc: 1
} as Document;

function ColumnNames(o: IBase) {
  return Object.keys(o).reduce((sum, key) =>
    o[`${key}DBColumn`] ? `${sum}\n  ${key} = ${o[`${key}DBColumn`]}` : sum
  );
}

// SQL 'SELECT Query' generator
function generator(o: IBase): string {
  let query = Object.keys(o).reduce(
    (sum, key) =>
      o[`${key}DBColumn`] ? `${sum}\n  ${o[`${key}DBColumn`]} as ${key},` : sum,
    "SELECT "
  );

  return query.substring(0, query.length - 1);
}

const documentQuery = generator(document);

// prints out everything in a readable format
console.log(document);
console.log("\nColumn names:");
console.log(ColumnNames(document));
console.log("\nSQL Query");
console.log(documentQuery);
console.log("DocumentTemplate", Object.keys(Document.prototype));
