import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAdmin, requireAuth } from "../middleware/authMiddleware.js";
import {
  createBarber,
  deleteBarber,
  getBarberById,
  linkUser,
  listBarbers,
  updateBarber,
} from "../controllers/barberController.js";

const router = Router();

// Listar / buscar — qualquer usuário logado (usado na Home e agendamento)
router.get("/barbers", requireAuth, asyncHandler(listBarbers));
router.get("/barbers/:id", requireAuth, asyncHandler(getBarberById));

// Criar / editar / vincular / remover — admin only
router.post("/barbers", requireAuth, requireAdmin, asyncHandler(createBarber));
router.put("/barbers/:id", requireAuth, requireAdmin, asyncHandler(updateBarber));
router.patch("/barbers/:id", requireAuth, requireAdmin, asyncHandler(updateBarber));
router.patch("/barbers/:id/link-user", requireAuth, requireAdmin, asyncHandler(linkUser));
router.delete("/barbers/:id", requireAuth, requireAdmin, asyncHandler(deleteBarber));

export default router;
