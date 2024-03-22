
export class UserNotFound extends Error {
    constructor(id: string) {
        super(`The user with name: ${id} not found.`);

        Object.setPrototypeOf(this, new.target.prototype);

        this.name = this.constructor.name;
    }
}