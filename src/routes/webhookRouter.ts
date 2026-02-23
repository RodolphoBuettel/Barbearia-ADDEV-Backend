import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { handleMercadoPagoWebhook } from "../controllers/webhookController.js";

const router = Router();

/**
 * Webhook do Mercado Pago — SEM autenticação JWT.
 * Valida assinatura HMAC internamente.
 */
router.post("/webhooks/mercadopago", asyncHandler(handleMercadoPagoWebhook));

export default router;
