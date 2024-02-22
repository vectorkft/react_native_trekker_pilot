export class ZodDTO{
    private code: string;
    private expected:string;
    private received:string;
    private path:string;
    private message: string

    constructor(code: string,message:string, expected:string, received:string, path:string[]) {
        if(!code ){
            throw new Error('Invalid parameters');
        }
        this.code = code??'';
        this.message = message??'';
        this.expected = expected;
        this.received = received;
        this.path = path.join('.');
    }

     static fromZodError(err: any) {
        if (err.issues && err.issues.length > 0) {
            return err.issues.map((issue: any) => new ZodDTO(issue.code,issue.message, issue.expected, issue.received, issue.path));
        } else {
            console.error(err);
            throw new Error('An unexpected error occurred');
        }
    }
}