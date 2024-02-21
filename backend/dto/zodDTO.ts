export class ZodDTO{
    private code: string;
    private expected:string;
    private received:string;
    private path:string[];

    constructor(code: string, expected:string, received:string, path:string[]) {
        if(!code ||!expected ||!received ||!path){
            throw new Error('Invalid parameters');
        }
        this.code = code;
        this.expected = expected;
        this.received = received;
        this.path = path;
    }
}