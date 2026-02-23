import joi from "joi";

export const CreateBlockedDateSchema = joi
  .object({
    date: joi
      .string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .required()
      .messages({ "string.pattern.base": "date deve ser YYYY-MM-DD" }),
    reason: joi.string().trim().allow("", null).optional(),
    barberId: joi.string().uuid().allow(null).optional().default(null),
  })
  .options({ abortEarly: false, stripUnknown: true });

export const ListBlockedDatesQuerySchema = joi
  .object({
    dateFrom: joi
      .string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    dateTo: joi
      .string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    date: joi
      .string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    barberId: joi.string().uuid().optional(),
  })
  .unknown(true);

export const BlockedDateIdParamSchema = joi.object({
  id: joi.string().uuid().required(),
});
