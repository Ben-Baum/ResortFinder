import { OkPacket } from "mysql";
import RoleModel from "../3-models/role-model";
import UserModel from "../3-models/user-model";
import dal from "../2-utils/dal";
import cyber from "../2-utils/cyber";
import CredentialsModel from "../3-models/credentials-model";
import { Unauthorized, Validation } from "../3-models/error-models";

class AuthService {

    public async register(user: UserModel): Promise<string> {
        const error = user.addUserValidation();
        if (error) throw new Validation(error);
        if(await isEmailTaken(user.email)) throw new Validation(`email: ${user.email} is already exist`);
        user.roleId = RoleModel.User;

        user.password = cyber.hashPassword(user.password);
        
        const sql = `INSERT INTO users VALUES(DEFAULT, ?, ?, ?, ?, ?)`;

        const info: OkPacket = await dal.execute(sql, 
        [user.firstName, 
        user.lastName, 
        user.email, 
        user.password, 
        user.roleId]);

        user.userId = info.insertId;

        // delete user.password;
        // delete user.userId;

        const token = cyber.getNewToken(user);

        return token
    }

    public async login(credentials: CredentialsModel): Promise<string> {

        const error = credentials.validate();
        if (error) throw new Validation(error);

        // credentials.password = cyber.hashPassword(credentials.password);
        const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;

        const users = await dal.execute(sql, [credentials.email, credentials.password]);

        const user = users[0];

        if(!user) throw new Unauthorized("Incorrect email or password.");

        // delete user.password;
        // delete user.userId;

        const token = cyber.getNewToken(user);

        return token
    }

    
}

async function isEmailTaken(email: string): Promise<boolean> {

    const sql = `SELECT COUNT(*) FROM users WHERE email = ?`;

    const count = await dal.execute(sql,[email]);

    return count > 0;
}

const authService = new AuthService();

export default authService;
