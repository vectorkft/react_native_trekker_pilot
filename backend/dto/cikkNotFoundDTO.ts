export class CikkNotFoundDTO{
    private message : string;
    private ean: number;

    constructor(message: string, ean: number) {
        if(!message ||!ean){
            throw new Error('Invalid parameters');
        }
        this.message = message;
        this.ean = ean;
    }
}