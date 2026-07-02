import { prisma } from "../../lib/prisma.js"

async function main() {
    // A ordem importa: id_categoria 1 e 4 são usados em cyberwares.seeds.ts,
    // então essas categorias precisam existir (e nessa ordem) antes de rodar aquele seed.
    await prisma.categoria.createMany({
        data: [
            { nome: "Óptica" },       // id 1
            { nome: "Neural" },       // id 2
            { nome: "Cardiovascular" }, // id 3
            { nome: "Membros" },      // id 4
        ],
        skipDuplicates: true,
    })

    console.log("✔️ Categorias inseridas com sucesso!")
}

main()
    .catch((e) => {
        console.error("Erro ao inserir categorias: ", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })