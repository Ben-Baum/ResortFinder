import { OkPacket } from "mysql";
import { fileSaver } from "uploaded-file-saver";
import appConfig from "../2-utils/app-config";
import dal from "../2-utils/dal";
import { ResourceNotFound } from "../3-models/error-models";
import LikeModel from "../3-models/like-model";
import likeModel from "../3-models/like-model";
import UserModel from "../3-models/user-model";
import VacationModel from "../3-models/vacation-model";

class VacationService {

    public async getAllVacations(userId: number): Promise<VacationModel[]>{
        
        const sql = `SELECT DISTINCT
                        V.*,
                        EXISTS(SELECT * FROM likes WHERE vacationId = L.vacationId AND userId = ?) AS islike,
                        COUNT(L.userId) AS likesCount
                        FROM vacation as V LEFT JOIN likes as L
                        ON V.vacationId = L.vacationId
                        GROUP BY vacationId
                        ORDER BY checkIn;`;

                    const vacations = await dal.execute(sql, [userId]);
                    return vacations;
                } 

    public async getAllUsers(): Promise<UserModel[]>{
        
        const sql = `SELECT 
                        userId,
                        firstName,
                        lastName,
                        email,
                        password,
                        roleId
                    FROM users`;

                    const users = await dal.execute(sql);
                    return users;
    }
    public async addVacation(vacation: VacationModel): Promise<VacationModel> {
        vacation.postValidate();

        const imageName = await fileSaver.add(vacation.image);
        
        const sql = `INSERT INTO vacation VALUES(DEFAULT ?, ?, ?, ?)`;
        const info: OkPacket = await dal.execute(sql [vacation.destination, vacation.description, vacation.checkin, vacation.checkout, vacation.price, imageName]);
        vacation.vacationId = info.insertId;
        vacation.imageUrl = appConfig.appHost + "/api/vacations/" + imageName;
        delete vacation.image; 
        return vacation;
    }

    public async updateVacation(vacation: VacationModel): Promise<VacationModel> {
        vacation.putValidate();
        const existingImageName = await this.getExistingImageName(vacation.vacationId);
        const imageName = vacation.image ? await fileSaver.update(existingImageName, vacation.image) : existingImageName;

        const sql = `UPDATE vacation SET
                        destination = ?,
                        description = ?,
                        checkin = ?,
                        checkout = ?,
                        price = ?,
                        imageName = ?
                    WHERE vacationId = ?`;

        const info: OkPacket = await dal.execute(sql, [vacation.destination, vacation.description, vacation.checkin, vacation.checkout, vacation.price, imageName, vacation.vacationId]);

        if (info.affectedRows === 0) throw new ResourceNotFound(vacation.vacationId); 
        delete vacation.image;
        vacation.imageUrl = appConfig.appHost + "/api/vacations/" + imageName;

        return vacation;
    }

    private async getExistingImageName(vacationId: number): Promise<string> {
        const sql = `SELECT imageName FROM vacation WHERE vacationId = ?`;
        const vacations = await dal.execute(sql, [vacationId]);
        const vacation = vacations[0];
        if (!vacation) return "";
        return vacation.imageName;
    }

    public async likeVacation(userId: string, vacationId: string): Promise<void> {
        const sql = "INSERT INTO likes VALUES(?,?)";
        await dal.execute(sql, [userId, vacationId]);
    }
    public async unlikeVacation(userId: string, vacationId: string): Promise<void> {
        const sql = "DELETE from likes WHERE userId = ? AND vacationId = ?";
        const info: OkPacket = await dal.execute(sql, [userId, vacationId]);
    }

}



const vacationService = new VacationService();

export default vacationService

