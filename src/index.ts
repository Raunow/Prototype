import { Document } from "./models/document";
import { Building } from "./models/building";

let obj;
if (true){
  let Template = new Document();
  obj = {
    uid: "dhiNXWAjdfwenfåOXZNDaWdnwSDobfui",
    id: 10,
    name: "nope",
    filename: "steff",
    test: 2,
    documentTypeId: 1,
    standardDoc: true,
    generalDoc: 1
  };

  Object.setPrototypeOf(obj, Template)
} else {
  let Template = new Building();
  obj = {
    uid: 'string',
      id: 1,
      name: 'string',
      parentId: 2,
      buildingName: 'string',
      typeId: 3,
      account: 'string',
      constructionYear: 4,
      usableArea: 5,
      heatedArea: 6,
      adminAreaId: 7,
      address: 'string',
      pictureFilename: 'string',
      info: 'string',
      overviewPictureFilename: 'string',
      livingArea: 8,
      localArea: 9,
      totalArea: 10,
      secondaryArea: 11,
      otherArea: 12,
      city: 'string',
      commonName: 'string',
      coordinates: 'string',
      qrCode: 'string',
      sumOfLivingAreaAndLocalArea: 13,
  };

  Object.setPrototypeOf(obj, Template)
}



// prints out everything in a readable format

console.log(obj);
console.log("\nDocumentTemplate:\n", Object.keys(Document.prototype));

console.log("\nColumn names:\n", (obj as Document).ColumnNames());
console.log("\nSQL Query:\n", (obj as Document).Select().Query);
console.log("\nSQL Update:\n", (obj as Document).Update().Query);
