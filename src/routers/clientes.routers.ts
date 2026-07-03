import { Router } from "express"
import { CriarCliente, ListarClientes, BuscarCliente, AtualizarCliente, DeletarCliente, SolicitarRecuperacaoSenha, RedefinirSenha, AlterarSenha } from "../controllers/clientes.controllers.js"
import { Authmiddleware } from "../middlewares/auth.middleswares.js"
import { AdminMiddleware } from "../middlewares/authAdmin.middlewares.js"
import { validarBody } from "../middlewares/Validation.middlewares.js"
import { criarClienteSchema, atualizarClienteSchema, solicitarRecuperacaoSenhaSchema, redefinirSenhaSchema, alterarSenhaSchema } from "../validators/schemas.js"

const router = Router()

router.post("/", validarBody(criarClienteSchema), CriarCliente)
router.get("/", ListarClientes)
router.post("/recuperar-senha", validarBody(solicitarRecuperacaoSenhaSchema), SolicitarRecuperacaoSenha)
router.post("/redefinir-senha", validarBody(redefinirSenhaSchema), RedefinirSenha)
router.patch("/alterar-senha", Authmiddleware, validarBody(alterarSenhaSchema), AlterarSenha)
router.get("/:id", BuscarCliente)
router.patch("/:id", validarBody(atualizarClienteSchema), AtualizarCliente)
router.delete("/:id", Authmiddleware, AdminMiddleware, DeletarCliente)

export default router