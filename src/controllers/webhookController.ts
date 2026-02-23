import { Request, Response } from "express";
import crypto from "crypto";
import { processWebhookNotification } from "../services/mercadoPagoService.js";
import { MP_WEBHOOK_SECRET } from "../config/mercadopago.js";

/**
 * POST /webhooks/mercadopago
 *
 * Recebe notificações do Mercado Pago (IPN / Webhooks v2).
 * Não exige autenticação JWT — é chamado pelo MP.
 * Valida assinatura HMAC quando MERCADO_PAGO_WEBHOOK_SECRET está configurado.
 */
export async function handleMercadoPagoWebhook(req: Request, res: Response) {
  // 1) Validar assinatura (se secret configurado)
  if (MP_WEBHOOK_SECRET) {
    const xSignature = req.headers["x-signature"] as string | undefined;
    const xRequestId = req.headers["x-request-id"] as string | undefined;

    if (xSignature && xRequestId) {
      const isValid = verifyWebhookSignature(xSignature, xRequestId, req.query, req.body);

      if (!isValid) {
        console.warn("[Webhook MP] Assinatura inválida — ignorando");
        return res.status(401).send({ error: "Assinatura inválida" });
      }
    }
  }

  // 2) Processar notificação
  const body = req.body;
  console.log("[Webhook MP] Recebido:", JSON.stringify(body));

  // O MP pode enviar via body ou query params
  const notificationType = body.type ?? (req.query.topic as string);
  const dataId = body.data?.id ?? (req.query.id as string);

  if (!notificationType) {
    return res.status(200).send({ ok: true, message: "no_type" });
  }

  try {
    const result = await processWebhookNotification({
      type: notificationType,
      action: body.action,
      data: { id: dataId },
      id: body.id,
    });

    console.log("[Webhook MP] Resultado:", JSON.stringify(result));
    return res.status(200).send({ ok: true, ...result });
  } catch (err: any) {
    console.error("[Webhook MP] Erro:", err.message);
    // Sempre retornar 200 para o MP não ficar re-enviando
    return res.status(200).send({ ok: false, error: err.message });
  }
}

/* ══════════════════════════════════════════════════
   Verificação de assinatura HMAC (Webhooks v2 do MP)
   ══════════════════════════════════════════════════ */

function verifyWebhookSignature(
  xSignature: string,
  xRequestId: string,
  query: any,
  _body: any
): boolean {
  try {
    // Extrair ts e v1 do header x-signature
    // Formato: "ts=xxx,v1=yyy"
    const parts: Record<string, string> = {};
    xSignature.split(",").forEach((part) => {
      const [key, ...rest] = part.trim().split("=");
      parts[key] = rest.join("=");
    });

    const ts = parts["ts"];
    const v1 = parts["v1"];
    if (!ts || !v1) return false;

    // Montar template para hash
    // id: query param "data.id"
    const dataId = query["data.id"] ?? "";
    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

    const hmac = crypto
      .createHmac("sha256", MP_WEBHOOK_SECRET)
      .update(manifest)
      .digest("hex");

    return hmac === v1;
  } catch {
    return false;
  }
}
