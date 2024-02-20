export class tokenDTO{
    private message : string;

    constructor(message: string) {
        if(!message){
            throw new Error('Invalid parameters');
        }
        this.message = message;
    }
}