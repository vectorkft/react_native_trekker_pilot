
export class registerDTO{
    private message : string;
    private username: string;
    private password: string;
    constructor(message: string, username: string, password: string) {
        if(!message ||!username ||!password){
            throw new Error('Invalid parameters');
        }
        this.message = message;
        this.username = username;
        this.password = password;
    }


}