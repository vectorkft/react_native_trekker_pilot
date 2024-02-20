import {NextFunction, Request, Response} from 'express';


export function Logger(req: Request, res: Response, next: NextFunction){
    const timestamp = new Date().toISOString();
    const { method, url, ip, body } = req;
    console.log(`
          ${timestamp} 
          ${method} ${url} 
          ${ip}
          ${JSON.stringify(body)}`);
    next();
}

