import { UploadedFile } from "express-fileupload";
import Joi from "joi";
import { Validation } from "./error-models";

class VacationModel {
   public vacationId: number;
   public destination: string;
   public description: string;
   public checkin: Date;
   public checkout: Date;
   public price: number;
   public image: UploadedFile;
   public imageUrl: string;
   public IsLikeIt: number;
   public LikesCount: number;

   public constructor(vacation: VacationModel) {
    this.vacationId = vacation.vacationId;
    this.description = vacation.description;
    this.destination = vacation.destination;
    this.checkin = vacation.checkin;
    this.checkout = vacation.checkout;
    this.price = vacation.price;
    this.image = vacation.image;
    this.imageUrl = vacation.imageUrl;
    this.IsLikeIt = vacation.IsLikeIt;
    this.LikesCount = vacation.LikesCount

   }

    private static postValidationSchema = Joi.object({
      vacationId: Joi.number().forbidden(),
      destination: Joi.string().required().min(2).max(50),
      description: Joi.string().required().min(7).max(1000),
      checkin: Joi.date().required(),
      checkout: Joi.date().required(),
      price: Joi.number().required().min(0).max(1000),
      image: Joi.object().required(),
      imageUrl: Joi.string().optional().min(50).max(200),
      IsLikeIt: Joi.number().forbidden(),
      LikesCount: Joi.number().forbidden()
  });

  private static putValidationSchema = Joi.object({
    vacationId: Joi.number().forbidden(),
    destination: Joi.string().required().min(2).max(50),
    description: Joi.string().required().min(7).max(1000),
    checkin: Joi.date().required(),
    checkout: Joi.date().required(),
    price: Joi.number().required().min(0).max(1000),
    image: Joi.object().optional(),
    imageUrl: Joi.string().optional().min(50).max(200),
    IsLikeIt: Joi.number().forbidden(),
    LikesCount: Joi.number().forbidden()
  });


  public postValidate(): void {
      const result = VacationModel.postValidationSchema.validate(this);
      if(result.error?.message) throw new Validation(result.error.message);
  }


  public putValidate(): void {
      const result = VacationModel.putValidationSchema.validate(this);
      if(result.error?.message) throw new Validation(result.error.message);
  }
}

export default VacationModel;