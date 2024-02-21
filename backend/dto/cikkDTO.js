"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CikkDTO = void 0;
class CikkDTO {
    constructor(cikkszam, cikknev, eankod) {
        if (!cikkszam || !cikknev || !eankod) {
            throw new Error('Invalid parameters');
        }
        this.cikkszam = cikkszam;
        this.cikknev = cikknev;
        this.eankod = eankod;
    }
}
exports.CikkDTO = CikkDTO;
