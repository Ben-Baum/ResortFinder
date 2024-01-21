import { Forbidden, Unauthorized } from "../3-models/error-models";
import RoleModel from "../3-models/role-model";
import UserModel from "../3-models/user-model";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import crypto from "crypto"

class Cyber {

    private secretKey = "only-me-can-see-it";

    public getNewToken(user: UserModel): string {
        delete user.password;
        const container = { user };
        const options = { expiresIn: "3h" };
        const token = jwt.sign(container, this.secretKey, options);
        return token;
    }

    public verifyToken(token: string): void {
        if (!token) throw new Unauthorized("You are not logged in.");
        try {
            jwt.verify(token, this.secretKey);
        } catch (err: any) {
            throw new Unauthorized(err.message);
        }
    }

    public verifyAdmin(token: string): void {
        this.verifyToken(token);
        const container = jwt.verify(token, this.secretKey) as { user: UserModel };
        const user = container.user;
        if(user.roleId !== RoleModel.Admin) throw new Forbidden("You are not admin.");
    }
    
    public hashPassword(plainText:string): string {
        if(!plainText) return null;
        const salt = "extra_salty";
        const hashPassword = crypto.createHmac("sha512", salt).update(plainText).digest("hex");
        return hashPassword
        
    }




}

const cyber = new Cyber();
export default cyber
