import express, {Request, Response, NextFunction} from "express"
import StatusCode from "../3-models/status-codes";
import VacationModel from "../3-models/vacation-model";
import vacationsService from "../5-services/vacations-service";

const router = express.Router();

router.get("/vacations/:userId", async (request:Request, response:Response, next:NextFunction) =>{
    try{
        const userId = +request.params.userId;
        const vacations = await vacationsService.getAllVacations(userId);
        response.json(vacations);
    }catch(err:any){
        next(err);
    }
   
});

router.post("/vacations", async (request: Request, response: Response, next: NextFunction) => {
    try {
        // request.body.image = request.file?.image;
        const vacation = new VacationModel(request.body);
        const addedVacation = await vacationsService.addVacation(vacation);
        response.status(StatusCode.Created).json(addedVacation);
    }
    catch (err: any) {
        next(err);
    }
});

router.put("/vacations/:vacationId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        request.body.vacationId = +request.params.vacationId;
        // request.body.image = request.file?.image; 
        const vacation = new VacationModel(request.body);
        const updatedVacation = await vacationsService.updateVacation(vacation);
        response.json(updatedVacation);
    }
    catch (err: any) {
        next(err);
    }
});
router.post("/vacations-like/:userId/:vacationId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = request.params.userId;
        const vacationId = request.params.vacationId;
        await vacationsService.likeVacation(userId, vacationId);
        response.status(StatusCode.Created).json();
    } catch (err: any) {
        next(err);
    }
});
router.delete("/vacations-unlike/:userId/:vacationId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = request.params.userId;
        const vacationId = request.params.vacationId;
        await vacationsService.unlikeVacation(userId, vacationId);
        response.status(StatusCode.NoContent).json();
    } catch (err: any) {
        next(err);
    }
});





export default router;