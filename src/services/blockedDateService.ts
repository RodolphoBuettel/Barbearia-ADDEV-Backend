import { badRequest, notFound } from "../errors/index.js";
import {
  createBlockedDate,
  deleteBlockedDate,
  findBlockedDateByDate,
  findBlockedDateByIdInBarbershop,
  listBlockedDatesInBarbershop,
} from "../repository/blockedDateRepository.js";
import { findBarberByIdInBarbershop } from "../repository/barberRepository.js";

/* ─────────────── helpers ─────────────── */

function serialize(bd: any) {
  return {
    id: bd.id,
    barbershopId: bd.barbershop_id,
    date: typeof bd.date === "string" ? bd.date : (bd.date as Date).toISOString().slice(0, 10),
    reason: bd.reason,
    barberId: bd.barber_id,
    barber: bd.barbers
      ? { id: bd.barbers.id, displayName: bd.barbers.display_name }
      : null,
    createdBy: bd.created_by,
    createdByUser: bd.users
      ? { id: bd.users.id, name: bd.users.name }
      : null,
    createdAt: bd.created_at,
    updatedAt: bd.updated_at,
  };
}

/* ───────── LIST ───────── */
export async function listBlockedDatesService(params: {
  barbershopId: string;
  query: {
    dateFrom?: string;
    dateTo?: string;
    barberId?: string;
  };
}) {
  const items = await listBlockedDatesInBarbershop({
    barbershopId: params.barbershopId,
    dateFrom: params.query.dateFrom,
    dateTo: params.query.dateTo,
    barberId: params.query.barberId,
  });

  return items.map(serialize);
}

/* ───────── CHECK DATE ───────── */
export async function checkBlockedDateService(params: {
  barbershopId: string;
  date: string;
  barberId?: string;
}) {
  const items = await findBlockedDateByDate(
    params.barbershopId,
    params.date,
    params.barberId
  );

  return {
    blocked: items.length > 0,
    items: items.map(serialize),
  };
}

/* ───────── CREATE ───────── */
export async function createBlockedDateService(params: {
  barbershopId: string;
  actorId: string;
  data: {
    date: string;
    reason?: string | null;
    barberId?: string | null;
  };
}) {
  // Validar que a data não é no passado
  const dateObj = new Date(params.data.date + "T00:00:00Z");
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (dateObj < today) {
    throw badRequest("Não é possível bloquear uma data no passado");
  }

  // Validar barbeiro se informado
  if (params.data.barberId) {
    const barber = await findBarberByIdInBarbershop(params.barbershopId, params.data.barberId);
    if (!barber) throw notFound("Barbeiro não encontrado");
  }

  const created = await createBlockedDate({
    barbershopId: params.barbershopId,
    date: dateObj,
    reason: params.data.reason,
    barberId: params.data.barberId,
    createdBy: params.actorId,
  });

  return serialize(created);
}

/* ───────── DELETE ───────── */
export async function deleteBlockedDateService(params: {
  barbershopId: string;
  blockedDateId: string;
}) {
  // Verificar existência
  const existing = await findBlockedDateByIdInBarbershop(params.barbershopId, params.blockedDateId);
  if (!existing) throw notFound("Data bloqueada não encontrada");

  await deleteBlockedDate(params.barbershopId, params.blockedDateId);
  return { message: "Data desbloqueada com sucesso" };
}
