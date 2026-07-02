import { prisma } from "../../lib/prisma.js"

async function main() {
    await prisma.categoria.createMany({
        data: [
            { nome: "Óptica" },       
            { nome: "Neural" },       
            { nome: "Cardiovascular" }, 
            { nome: "Membros" },     
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