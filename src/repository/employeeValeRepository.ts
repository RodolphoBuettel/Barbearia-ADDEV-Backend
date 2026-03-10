import prisma from "../database/database.js";

/* ───── LIST ───── */
export async function listEmployeeVales(barbershopId: string) {
  return prisma.employee_vales.findMany({
    where: { barbershop_id: barbershopId },
    orderBy: { created_at: "desc" },
    include: {
      employee: { select: { id: true, name: true } },
      creator: { select: { id: true, name: true } },
    },
  });
}

/* ───── FIND BY ID ───── */
export async function findEmployeeValeById(barbershopId: string, id: string) {
  return prisma.employee_vales.findFirst({
    where: { id, barbershop_id: barbershopId },
  });
}

/* ───── CREATE ───── */
export async function createEmployeeVale(data: {
  employeeId: string;
  amount: number;
  note?: string | null;
  date: Date;
  createdBy: string;
  barbershopId: string;
}) {
  return prisma.employee_vales.create({
    data: {
      employee_id: data.employeeId,
      amount: data.amount,
      note: data.note ?? null,
      date: data.date,
      created_by: data.createdBy,
      barbershop_id: data.barbershopId,
    },
    include: {
      employee: { select: { id: true, name: true } },
      creator: { select: { id: true, name: true } },
    },
  });
}

/* ───── DELETE ───── */
export async function deleteEmployeeVale(barbershopId: string, id: string) {
  return prisma.employee_vales.deleteMany({
    where: { id, barbershop_id: barbershopId },
  });
}
