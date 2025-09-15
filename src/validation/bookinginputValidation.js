import Joi from "joi";

export const hotelBookingSchema = Joi.object({
  hotelId: Joi.string().required().messages({
    "string.base": "Hotel ID must be a string",
    "any.required": "Hotel ID is required",
  }),

  userId: Joi.string().required().messages({
    "string.base": "User ID must be a string",
    "any.required": "User ID is required",
  }),

  roomDetails: Joi.object({
    roomType: Joi.string().required().messages({
      "any.required": "Room type is required",
    }),
    roomCount: Joi.number().integer().min(1).required().messages({
      "number.base": "Room count must be a number",
      "number.min": "At least 1 room is required",
      "any.required": "Room count is required",
    }),
    guestCount: Joi.number().integer().min(1).required().messages({
      "number.base": "Guest count must be a number",
      "number.min": "At least 1 guest is required",
      "any.required": "Guest count is required",
    }),
  }).required(),

  dates: Joi.object({
    checkIn: Joi.date().iso().min("now").required().messages({
      "date.base": "Check-in must be a valid date",
      "any.required": "Check-in date is required",
    }),
    checkOut: Joi.date().iso().greater(Joi.ref("checkIn")).required().messages({
      "date.base": "Check-out must be a valid date",
      "date.greater": "Check-out must be after check-in date",
      "any.required": "Check-out date is required",
    }),
  }).required(),

  guestDetails: Joi.array()
    .items(
      Joi.object({
        firstName: Joi.string().required().messages({
          "any.required": "First name is required",
        }),
        lastName: Joi.string().required().messages({
          "any.required": "Last name is required",
        }),
        age: Joi.number().integer().min(18).required().messages({
          "number.base": "Age must be a number",
          "any.required": "Age is required",
        }),
        type: Joi.string()
          .valid("primary", "secondary")
          .required()
          .messages({
            "any.only": "Type must be either 'primary' or 'secondary'",
            "any.required": "Guest type is required",
          }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one guest is required",
      "any.required": "Guest details are required",
    }),
});
