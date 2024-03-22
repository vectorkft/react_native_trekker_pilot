import {JwtPayload} from "jsonwebtoken";

export interface Payload extends JwtPayload {
    name: string;
    szemelykod: string;
    tokenType: string;
}