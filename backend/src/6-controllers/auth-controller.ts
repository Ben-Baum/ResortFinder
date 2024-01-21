import UserModel from "../3-models/user-model";
import authService from "../5-services/auth-service";
import StatusCode from "../3-models/status-codes";
import CredentialsModel from "../3-models/credentials-model";
import express, { Request, Response, NextFunction } from "express";

const router = express.Router();

router.post("/register", async (request:Request, response:Response, next:NextFunction) => {
    try {
        const user = new UserModel(request.body);
        const token = await authService.register(user);
        return response.status(StatusCode.Created).json(token);
    } catch(err: any) {
        next(err);
    }
});

router.post("/login", async ( request: Request, response: Response, next: NextFunction) => {
    try {
        console.log("Entering /login route handler");
        const credentials = new CredentialsModel(request.body);
        console.log("Entering /token handler");
        const token = await authService.login(credentials);
        return response.json(token);

    }catch (err: any) {
        next(err);
    }
});

export default router;
