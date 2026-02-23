import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN ?? "";

if (!accessToken) {
  console.warn("[MercadoPago] MERCADO_PAGO_ACCESS_TOKEN não definido!");
}

const mpClient = new MercadoPagoConfig({ accessToken });

export const mpPayment = new Payment(mpClient);
export const mpPreference = new Preference(mpClient);
export const MP_WEBHOOK_SECRET = process.env.MERCADO_PAGO_WEBHOOK_SECRET ?? "";
export const MP_NOTIFICATION_URL = process.env.MERCADO_PAGO_NOTIFICATION_URL ?? "";

export default mpClient;
