import { Router } from "express"
import { login } from "../controllers/auth.controllers.js"
import { validarBody } from "../middlewares/Validation.middlewares.js"
import { loginSchema } from "../validators/schemas.js"

const router = Router()

router.post("/login", validarBody(loginSchema), login)

export default router