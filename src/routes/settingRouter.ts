import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAdmin, requireAuth } from "../middleware/authMiddleware.js";
import { getSettings, upsertSettings, getHomeInfo, upsertHomeInfo } from "../controllers/settingsController.js";

const router = Router();

// ler: qualquer usuário autenticado
router.get("/settings", requireAuth, asyncHandler(getSettings));
router.get("/home-info", requireAuth, asyncHandler(getHomeInfo));

// escrever: só admin
router.put("/settings", requireAuth, requireAdmin, asyncHandler(upsertSettings));
router.put("/home-info", requireAuth, requireAdmin, asyncHandler(upsertHomeInfo));

export default router;
