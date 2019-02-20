import { DBColumn, Filterable, DBTable, CopyTo } from "../libs/decorators";
import { IBase } from "./base";

//Model for building
@DBTable('Fastighet')
class Building extends IBase {
    @DBColumn('fid')
    @Filterable(typeof Number)
    id: number;

    @DBColumn('Namn')
    @Filterable(typeof String)
    name: string;

    @DBColumn('tree_FID.FID') //TODO -----
    parentId: number;

    @DBColumn('Beteckning')
    @Filterable(typeof String)
    buildingName: string;

    @DBColumn('FTID')
    @Filterable(typeof Number)
    typeId: number;

    @DBColumn('konto')
    account: string;

    @DBColumn('byggnadsar')
    constructionYear: number;

    @DBColumn('bra')
    usableArea: number;

    @DBColumn('brakall')
    heatedArea: number;

    @DBColumn('OID')
    adminAreaId: number;

    @DBColumn('Adress')
    address: string;

    @DBColumn('bildfil')
    pictureFilename: string;

    @DBColumn('info')
    info: string;

    @DBColumn('overpic')
    overviewPictureFilename: string;

    @DBColumn('boa')
    livingArea: number;

    @DBColumn('loa')
    localArea: number;

    @DBColumn('bta')
    totalArea: number;

    @DBColumn('bia')
    secondaryArea: number;

    @DBColumn('ova')
    otherArea: number;

    @DBColumn('ort')
    city: string;

    @DBColumn('pop_namn')
    commonName: string;

    @DBColumn('koordinates')
    coordinates: string;

    @DBColumn('uif')
    qrCode: string;

    @DBColumn('boa_loa')
    sumOfLivingAreaAndLocalArea: number;

}

export { Building }