import { prisma } from "../../lib/prisma.js"

async function main() {
    // Busca os registros pelo nome/email em vez de assumir IDs fixos,
    // assim o seed funciona independente da ordem em que os outros seeds rodaram.
    const david = await prisma.clientes.findUnique({ where: { email: "david@edgerunners.com" } })
    const lucy = await prisma.clientes.findUnique({ where: { email: "lucy@netrunner.com" } })

    const oticas = await prisma.cyberwares.findFirst({ where: { nome: "Óticas Kiroshi Mk.3" } })
    const bracos = await prisma.cyberwares.findFirst({ where: { nome: "Braços de Gorila" } })
    const laminas = await prisma.cyberwares.findFirst({ where: { nome: "Lâminas Louva-a-Deus" } })

    if (!david || !lucy || !oticas || !bracos || !laminas) {
        throw new Error(
            "Não foi possível encontrar clientes/cyberwares necessários. Rode antes os seeds de clientes e cyberwares."
        )
    }

    await prisma.instalacoes.createMany({
        data: [
            { id_cliente: david.id, id_cyber: oticas.id },
            { id_cliente: david.id, id_cyber: bracos.id },
            { id_cliente: lucy.id, id_cyber: laminas.id },
        ],
    })

    console.log("✔️ Instalações inseridas com sucesso!")
}

main()
    .catch((e) => {
        console.error("Erro ao inserir instalações: ", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })