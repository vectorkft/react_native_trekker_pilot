export class ProfileDTO{

    private username:string;

    constructor(username:string) {
        if(!username){
            throw new Error('Invalid parameters');
        }
        this.username = username;
    }


}