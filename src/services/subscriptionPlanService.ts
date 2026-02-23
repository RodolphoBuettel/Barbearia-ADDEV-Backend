import { notFound } from "../errors/index.js";
import {
  createPlanInBarbershop,
  deletePlanFromBarbershop,
  findPlanByIdInBarbershop,
  listPlansInBarbershop,
  updatePlanInBarbershop,
} from "../repository/subscriptionPlanRepository.js";

/* ─────────────── helpers ─────────────── */

function decimalToNumber(v: any): number {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  if (typeof v?.toNumber === "function") return v.toNumber();
  return Number(v);
}

function serialize(plan: any) {
  return {
    id: plan.id,
    barbershopId: plan.barbershop_id,
    name: plan.name,
    subtitle: plan.subtitle,
    price: decimalToNumber(plan.price),
    color: plan.color,
    cutsPerMonth: plan.cuts_per_month,
    active: plan.active,
    recommended: plan.recommended,
    mpSubscriptionUrl: plan.mp_subscription_url,
    features: (plan.subscription_plan_features ?? []).map((f: any) => f.feature),
    createdAt: plan.created_at,
    updatedAt: plan.updated_at,
  };
}

/* ───────── LIST ───────── */
export async function listPlansService(params: {
  barbershopId: string;
  activeOnly?: boolean;
}) {
  const items = await listPlansInBarbershop({
    barbershopId: params.barbershopId,
    activeOnly: params.activeOnly,
  });
  return items.map(serialize);
}

/* ───────── GET BY ID ───────── */
export async function getPlanByIdService(params: {
  barbershopId: string;
  planId: string;
}) {
  const plan = await findPlanByIdInBarbershop(params.barbershopId, params.planId);
  if (!plan) throw notFound("Plano não encontrado");
  return serialize(plan);
}

/* ───────── CREATE ───────── */
export async function createPlanService(params: {
  barbershopId: string;
  data: {
    name: string;
    subtitle?: string | null;
    price: number;
    color?: string | null;
    cutsPerMonth: number;
    active?: boolean;
    recommended?: boolean;
    mpSubscriptionUrl?: string | null;
    features?: string[];
  };
}) {
  const created = await createPlanInBarbershop({
    barbershopId: params.barbershopId,
    ...params.data,
  });
  return serialize(created);
}

/* ───────── UPDATE ───────── */
export async function updatePlanService(params: {
  barbershopId: string;
  planId: string;
  data: {
    name?: string;
    subtitle?: string | null;
    price?: number;
    color?: string | null;
    cutsPerMonth?: number;
    active?: boolean;
    recommended?: boolean;
    mpSubscriptionUrl?: string | null;
    features?: string[];
  };
}) {
  const updated = await updatePlanInBarbershop(
    params.barbershopId,
    params.planId,
    params.data
  );
  if (!updated) throw notFound("Plano não encontrado");
  return serialize(updated);
}

/* ───────── DELETE ───────── */
export async function deletePlanService(params: {
  barbershopId: string;
  planId: string;
}) {
  const deleted = await deletePlanFromBarbershop(params.barbershopId, params.planId);
  if (!deleted) throw notFound("Plano não encontrado");
  return { message: "Plano removido com sucesso" };
}
