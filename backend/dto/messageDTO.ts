export class MessageDTO{
    private message :string;

    constructor(message: string) {
        if(!message){
            throw new Error('Invalid parameters');
        }
        this.message = message;
    }
}