import {TypeOf, ZodType} from "zod/lib/types";

export const enum ValidTypes{
    ean = 'ean',
    etk = 'etk',
    both = 'both',
}

// TODO: types,parseTypes interface

export interface ValidatorProp<T extends ZodType<any, any, any>>{
    name: string;
    parseType: TypeOf<T>;
}

export interface ValidatorProps{
    propList: ValidatorProp<any>[];
}