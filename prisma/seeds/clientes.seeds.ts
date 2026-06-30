import { prisma } from "../../lib/prisma.js"

async function main() {

    await prisma.clientes.createMany({
        data: [
            {
                nome: "Administrador do Sistema",
                email: "admin@cyberware.com",
                senha: "admin",
                tipo: "ADMIN",
                saldo: 999999.99
            },
            {
                nome: "David Martinez",
                email: "david@edgerunners.com",
                senha: "123",
                tipo: "CLIENTE",
                saldo: 5000.00
            },
            {
                nome: "Lucy Kushinada",
                email: "lucy@netrunner.com",
                senha: "123",
                tipo: "CLIENTE",
                saldo: 12500.50
            }
        ],
        skipDuplicates: true, // Evita erros se tentar rodar o seed mais de uma vez
    })

    console.log("✔️ Clientes e Admin inseridos com sucesso!")
}

main()
    .catch((e) => {
        console.error("Erro ao inserir clientes: ", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })