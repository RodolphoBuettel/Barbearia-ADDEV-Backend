// src/routers/serviceRouter.ts
import { Router } from "express";
import {
  createService,
  deleteService,
  getServiceById,
  importServices,
  listServices,
  updateService,
} from "../controllers/serviceController.js";
import { requireAdmin, requireAuth } from "../middleware/authMiddleware.js";

const route = Router();

// list / details: qualquer usuário logado da barbearia
// route.get("/services", requireAuth, listServices);
// route.get("/services/:id", requireAuth, getServiceById);

route.get("/services", listServices);
route.get("/services/:id", getServiceById);

// create/update/delete: só admin
route.post("/services", requireAuth, requireAdmin, createService);
route.post("/services/import", requireAuth, requireAdmin, importServices);
route.patch("/services/:id", requireAuth, requireAdmin, updateService);
route.delete("/services/:id", requireAuth, requireAdmin, deleteService);

export default route;
