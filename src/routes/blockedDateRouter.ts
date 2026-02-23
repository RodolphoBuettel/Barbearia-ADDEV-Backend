import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAdmin, requireAuth } from "../middleware/authMiddleware.js";
import {
  createBlockedDate,
  deleteBlockedDate,
  listBlockedDates,
} from "../controllers/blockedDateController.js";

const router = Router();

// Listar / verificar data — qualquer usuário logado (usado na tela de agendamento)
router.get("/blocked-dates", requireAuth, asyncHandler(listBlockedDates));

// Bloquear data — admin only
router.post("/blocked-dates", requireAuth, requireAdmin, asyncHandler(createBlockedDate));

// Desbloquear data — admin only
router.delete("/blocked-dates/:id", requireAuth, requireAdmin, asyncHandler(deleteBlockedDate));

export default router;
