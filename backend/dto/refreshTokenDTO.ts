export class RefreshTokenDTO{
    private message : string;
    private newAccessToken: string;

    constructor(message: string, newAccessToken: string) {
        if(!message ||!newAccessToken){
            throw new Error('Invalid parameters');
        }
        this.message = message;
        this.newAccessToken = newAccessToken;
    }
}