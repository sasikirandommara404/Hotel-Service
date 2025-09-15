import joi from 'joi';

export const hotelSearchSchema = joi.object({
    location:joi.string().required().messages({
        'string.base': "location should be a type of 'text",
        'string.empty': "location cannot be an empty field",
    }).required(),
    dates:joi.object({
        checkIn:joi.date().iso().min("now").required().messages({
            'date.base': "checkIn should be a valid date",
            'any.required': "checkIn is a required field"
        }),
        checkOut:joi.date().iso().min("now").required().messages({
            'date.base': "checkOut should be a valid date",
            'any.required': "checkOut is a required field"
        })

    }).required(),
    guests:joi.object({
        adults:joi.number().integer().min(1).required().messages({
            'number.base': "adults should be a type of 'number'",
            'number.min': "at least one adult is required",
        }),
        children:joi.number().integer().min(0).default(0).messages({
            'number.base': "children should be a type of 'number'",
        }),
        rooms:joi.number().integer().min(1).required().messages({
            'number.min': "at least one room is required",
        })
    }).required()
})