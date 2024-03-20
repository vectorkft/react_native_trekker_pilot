import {NextFunction, Request, Response} from 'express';

import Chalk from 'chalk';

export function Logger(req: Request, res: Response, next: NextFunction){
    const timestamp = new Date().toISOString();
    const { method, url, ip, body } = req;
    console.log(Chalk.cyan(`
          Incoming Request
          
          ${timestamp} 
          ${method} ${url} 
          ${ip}
          ${JSON.stringify(body)}`));

    next();
}

