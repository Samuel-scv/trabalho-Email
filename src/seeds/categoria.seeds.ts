import { prisma } from "../../lib/prisma.js"
 
async function seedCategorias() {
    await prisma.categoria.createMany({
        data: [
            { nome: "Sistema Nervoso" },
            { nome: "Membros Cibernéticos" },
            { nome: "Visão" },
            { nome: "Audição" },
            { nome: "Esqueleto" },
        ]
    })
    console.log("categorias criadas")
}
 
seedCategorias()
    .catch((e) => { console.error(e) })
    .finally(async () => { await prisma.$disconnect() })
 