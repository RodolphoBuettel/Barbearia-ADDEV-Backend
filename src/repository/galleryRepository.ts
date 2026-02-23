import prisma from "../database/database.js";

/* ───── LIST ───── */
export async function listGalleryImagesInBarbershop(barbershopId: string) {
  return prisma.gallery_images.findMany({
    where: { barbershop_id: barbershopId },
    orderBy: { sort_order: "asc" },
  });
}

/* ───── GET BY ID ───── */
export async function findGalleryImageById(barbershopId: string, id: string) {
  return prisma.gallery_images.findFirst({
    where: { id, barbershop_id: barbershopId },
  });
}

/* ───── CREATE ───── */
export async function createGalleryImage(data: {
  barbershopId: string;
  url: string;
  alt?: string | null;
  sortOrder?: number;
}) {
  return prisma.gallery_images.create({
    data: {
      barbershop_id: data.barbershopId,
      url: data.url,
      alt: data.alt ?? null,
      sort_order: data.sortOrder ?? 0,
    },
  });
}

/* ───── DELETE ───── */
export async function deleteGalleryImage(barbershopId: string, id: string) {
  const existing = await prisma.gallery_images.findFirst({
    where: { id, barbershop_id: barbershopId },
  });
  if (!existing) return null;

  await prisma.gallery_images.delete({ where: { id } });
  return existing;
}
