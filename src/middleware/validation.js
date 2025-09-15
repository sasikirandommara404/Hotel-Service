import AppError from "../utils.Hotels/appError.js"
export const validateInputData = (data)=>{
    return async (req,res,next)=>{
        try{
            const {error} = await data.validate(req.body,{abortEarly:false});
            if (error){
                throw new AppError(`Validation error: ${error.details.map(x => x.message).join(', ')}`, 400);

            }
            next();
        }catch(err){
            next(err);
        }

    }
}