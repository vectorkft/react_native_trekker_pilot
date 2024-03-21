import {NextFunction, Request, Response} from 'express';

import Chalk from 'chalk';

const logDivider = "-------------------------------------------------";

export function Logger(req: Request, res: Response, next: NextFunction){
    const timestamp = new Date().toISOString();
    const { method, url, ip, body } = req;
    console.log(Chalk.cyan(`
          ${logDivider}
          Incoming Request
          
          ${timestamp} 
          ${method} ${url} 
          ${ip}
          ${JSON.stringify(body)}
          ${logDivider}`));

    // Store the original send method
    const originalSend = res.send;

    // Override the res.send method
    res.send = function(body: string | Buffer) {
        let parsedBody;
        try {
            parsedBody = JSON.parse(body.toString());
        } catch(e) {
            parsedBody = body;
        }

        console.log(Chalk.yellow(`
            ${logDivider}
            Outgoing Response

            ${timestamp}
            ${method} ${url}
            ${ip}
            ${JSON.stringify(parsedBody, null, 2)}
            ${logDivider}`));

        // Call the original send method
        return originalSend.call(res, body);
    };

    next();
}

