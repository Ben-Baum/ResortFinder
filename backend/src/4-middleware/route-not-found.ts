import { Request, Response, NextFunction } from "express";
import { RouteNotFound } from "../3-models/error-models";


function routeNotFound(request: Request, response: Response, next: NextFunction): void {

    const err = new RouteNotFound(request.originalUrl);

    next(err);
}

export default routeNotFound;
