export class CikkDTO {
    private cikkszam: number;
    private cikknev : string;
    private eankod : number;

    constructor(cikkszam: number, cikknev: string, eankod: number) {
        if(!cikkszam ||!cikknev ||!eankod){
            throw new Error('Invalid parameters');
        }
        this.cikkszam = cikkszam;
        this.cikknev = cikknev;
        this.eankod = eankod;
    }

}