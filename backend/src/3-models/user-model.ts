import Joi from "joi";
import RoleModel from "./role-model";
import { Validation } from "./error-models";

class UserModel {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roleId: RoleModel
    
    public constructor (user: UserModel) {
        this.userId = user.userId;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.password = user.password;
        this.roleId = user.roleId;
    }

    private static validationSchema = Joi.object({
        userId: Joi.number().optional().integer().positive(),
        firstName: Joi.string().required().min(2).max(20),
        lastName: Joi.string().required().min(2).max(20),
        email: Joi.string().required().min(4).max(20),
        password: Joi.string().required().min(4).max(20),
    });

    public addUserValidation(): string {
        const result = UserModel.validationSchema.validate(this);
        return result.error?.message
    }
}

export default UserModel;