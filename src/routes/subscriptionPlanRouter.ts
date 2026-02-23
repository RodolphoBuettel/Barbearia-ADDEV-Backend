import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAdmin, requireAuth } from "../middleware/authMiddleware.js";
import {
  createPlan,
  deletePlan,
  getPlanById,
  listPlans,
  updatePlan,
} from "../controllers/subscriptionPlanController.js";

const router = Router();

// Listar / buscar — qualquer usuário logado (exibido na tela de planos)
router.get("/subscription-plans", requireAuth, asyncHandler(listPlans));
router.get("/subscription-plans/:id", requireAuth, asyncHandler(getPlanById));

// CRUD — admin only
router.post("/subscription-plans", requireAuth, requireAdmin, asyncHandler(createPlan));
router.put("/subscription-plans/:id", requireAuth, requireAdmin, asyncHandler(updatePlan));
router.patch("/subscription-plans/:id", requireAuth, requireAdmin, asyncHandler(updatePlan));
router.delete("/subscription-plans/:id", requireAuth, requireAdmin, asyncHandler(deletePlan));

export default router;
