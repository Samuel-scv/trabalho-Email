import { z } from "zod"

const senhaSchema = z
    .string()
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
        "a senha deve ter no mínimo 8 caracteres, incluindo letra maiúscula, letra minúscula, número e símbolo (ex: !@#$%)"
    )

export const loginSchema = z.object({
    email: z.string().email("email inválido"),
    senha: z.string().min(1, "senha é obrigatória")
})

export const criarClienteSchema = z.object({
    nome: z.string().min(1, "nome é obrigatório"),
    email: z.string().email("email inválido"),
    senha: senhaSchema,
    saldo: z.number({ error: "saldo é obrigatório" }),
    tipo: z.enum(["CLIENTE", "ADMIN"], { error: "tipo deve ser 'CLIENTE' ou 'ADMIN'" })
})

export const atualizarClienteSchema = z.object({
    nome: z.string().min(1, "nome é obrigatório"),
    email: z.string().email("email inválido"),
    saldo: z.number({ error: "saldo é obrigatório" })
})

export const solicitarRecuperacaoSenhaSchema = z.object({
    email: z.string().email("email inválido")
})

export const redefinirSenhaSchema = z.object({
    email: z.string().email("email inválido"),
    codigo: z.string().length(4, "código deve ter 4 caracteres"),
    novaSenha: senhaSchema
})

export const alterarSenhaSchema = z.object({
    senhaAtual: z.string().min(1, "senha atual é obrigatória"),
    novaSenha: senhaSchema
})

export const categoriaSchema = z.object({
    nome: z.string().min(1, "nome é obrigatório")
})

export const cyberwareSchema = z.object({
    nome: z.string().min(1, "nome é obrigatório"),
    preco: z.number({ error: "preco é obrigatório" }).positive("preco deve ser positivo"),
    estoque: z.string().min(1, "estoque é obrigatório"),
    id_categoria: z.number({ error: "id_categoria é obrigatório" })
})

export const instalacaoSchema = z.object({
    id_cliente: z.number({ error: "id_cliente é obrigatório" }),
    id_cyber: z.number({ error: "id_cyber é obrigatório" })
})