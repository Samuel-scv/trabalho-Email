import { prisma } from "../../lib/prisma.js"
import bcrypt from "bcryptjs"

async function main() {

    const senhaAdmin = await bcrypt.hash("Admin@123", 10)
    const senhaDavid = await bcrypt.hash("David@123", 10)
    const senhaLucy = await bcrypt.hash("Lucy@1234", 10)

    await prisma.clientes.createMany({
        data: [
            {
                nome: "Administrador do Sistema",
                email: "admin@cyberware.com",
                senha: senhaAdmin,
                tipo: "ADMIN",
                saldo: 999999.99
            },
            {
                nome: "David Martinez",
                email: "david@edgerunners.com",
                senha: senhaDavid,
                tipo: "CLIENTE",
                saldo: 5000.00
            },
            {
                nome: "Lucy Kushinada",
                email: "lucy@netrunner.com",
                senha: senhaLucy,
                tipo: "CLIENTE",
                saldo: 12500.50
            }
        ],
        skipDuplicates: true,
    })

    console.log("Clientes e Admin inseridos com sucesso!")
}

main()
    .catch((e) => {
        console.error("Erro ao inserir clientes: ", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })