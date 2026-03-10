import joi from "joi";

export const CreateEmployeePaymentSchema = joi
  .object({
    employeeId: joi.string().uuid().required(),
    employeeName: joi.string().trim().min(1).required(),
    period: joi.string().valid("semanal", "quinzenal", "mensal").required(),
    periodStart: joi.string().trim().required(),
    periodEnd: joi.string().trim().required(),
    salarioFixo: joi.number().min(0).default(0),
    commission: joi.number().min(0).default(0),
    totalVales: joi.number().min(0).default(0),
    liquido: joi.number().required(),
  })
  .options({ abortEarly: false, stripUnknown: true });
