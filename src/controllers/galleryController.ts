import { Request, Response } from "express";
import {
  CreateGalleryImageSchema,
  GalleryImageIdParamSchema,
} from "../models/gallerySchemas.js";
import {
  createGalleryImageService,
  deleteGalleryImageService,
  listGalleryService,
} from "../services/galleryService.js";

function joiErrors(error: any) {
  return error.details?.map((d: any) => d.message) ?? ["Dados inválidos"];
}

/* ───── LIST ───── */
export async function listGallery(req: Request, res: Response) {
  const result = await listGalleryService({
    barbershopId: req.user!.barbershopId,
  });

  return res.status(200).send(result);
}

/* ───── CREATE ───── */
export async function createGalleryImage(req: Request, res: Response) {
  const { error, value } = CreateGalleryImageSchema.validate(req.body);
  if (error) return res.status(422).send(joiErrors(error));

  const result = await createGalleryImageService({
    barbershopId: req.user!.barbershopId,
    data: value,
  });

  return res.status(201).send(result);
}

/* ───── DELETE ───── */
export async function deleteGalleryImage(req: Request, res: Response) {
  const { error } = GalleryImageIdParamSchema.validate(req.params);
  if (error) return res.status(422).send(joiErrors(error));

  const result = await deleteGalleryImageService({
    barbershopId: req.user!.barbershopId,
    imageId: req.params.id,
  });

  return res.status(200).send(result);
}
