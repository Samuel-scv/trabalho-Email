import { Router } from "express";
import { ListarLogs, BuscarLogsPorCliente } from "../controllers/logs.controllers.js";
import { Authmiddleware } from "../../auth.middlewares.js"
import { AdminMiddleware } from "../../authAdmin.middlewares.js"

const router = Router();

router.get("/", Authmiddleware, AdminMiddleware, ListarLogs);
router.get("/cliente/:clienteId", Authmiddleware, AdminMiddleware, BuscarLogsPorCliente);

export default router;