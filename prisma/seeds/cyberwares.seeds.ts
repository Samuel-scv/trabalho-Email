import { PrismaClient } from '../../generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
    // Lembre-se que o id_categoria precisa de corresponder aos IDs criados no seed anterior.
    // Assumindo que a categoria "Ótico" ficou com ID 1 e "Braços" com ID 4
    await prisma.cyberwares.createMany({
        data: [
            {
                nome: "Óticas Kiroshi Mk.3",
                descricao: "Scanner de alto desempenho com zoom ótico.",
                preco: 3500.00,
                estoque: "15",
                id_categoria: 1
            },
            {
                nome: "Braços de Gorila",
                descricao: "Aumenta drasticamente a força física.",
                preco: 12000.00,
                estoque: "5",
                id_categoria: 4
            },
            {
                nome: "Lâminas Louva-a-Deus",
                descricao: "Lâminas letais retráteis nos antebraços.",
                preco: 15500.00,
                estoque: "3",
                id_categoria: 4
            }
        ],
        skipDuplicates: true,
    })

    console.log("✔️ Cyberwares inseridos com sucesso!")
}

main()
    .catch((e) => {
        console.error("Erro ao inserir cyberwares: ", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })