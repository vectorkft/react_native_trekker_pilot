export class MenuNotFound extends Error {
    constructor(id: string) {
        super(`The menu with id: ${id} not found.`);

        Object.setPrototypeOf(this, new.target.prototype);

        this.name = this.constructor.name;
    }
}