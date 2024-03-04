
export class loginDTO {

    private message : string;
    private accessToken : string;
    private refreshToken : string;
    private userId: number;
    private currentTime: number;

    constructor(message: string, accessToken: string, refreshToken: string, userId: number, currentTime: number) {
        if(!message || !accessToken || !userId || !currentTime){
            throw new Error('Invalid parameters');
        }
        this.message = message;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.userId = userId;
        this.currentTime = currentTime;
    }

}