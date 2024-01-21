import { NextFunction, Request, Response } from "express";
import StatusCode from "../3-models/status-codes";

function catchAll(err: any, req: Request, response: Response, next: NextFunction): void {

    const status = err.status ? err.status : StatusCode.InternalServerError;
 
    response.sendStatus(status).json(err)
}

export default catchAll;
