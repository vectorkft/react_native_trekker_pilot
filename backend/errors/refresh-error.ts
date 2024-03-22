export class RefreshError extends Error {
    constructor() {
        super(`You tried to use AccessToken as RefreshToken`);

        Object.setPrototypeOf(this, new.target.prototype);

        this.name = this.constructor.name;
    }
}