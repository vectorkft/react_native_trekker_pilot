import {TypeOf, ZodType} from "zod/lib/types";
export interface ValidatorProp<T extends ZodType<any, any, any>>{
    type: string;
    parseType: TypeOf<T>;
}

export interface ValidatorProps{
    propList: ValidatorProp<any>[];
}