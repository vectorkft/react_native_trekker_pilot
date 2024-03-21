import {JwtPayload} from "jsonwebtoken";

export interface VPayload extends JwtPayload {
    name: string;
    szemelykod: string;
    tokenType: string;
}