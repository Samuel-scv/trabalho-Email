import { prisma } from "../../lib/prisma.js"
 
async function seedCyberwares() {
    await prisma.cyberwares.createMany({
        data: [
            { nome: "Kiroshi Optical MK.3", preco: 1200, estoque: "10", id_categoria: 3 },
            { nome: "Mantis Blades", preco: 2500, estoque: "5", id_categoria: 2 },
            { nome: "Gorilla Arms", preco: 3000, estoque: "4", id_categoria: 2 },
            { nome: "Sandy Sandevistan MK.5", preco: 4500, estoque: "3", id_categoria: 1 },
            { nome: "Bionic Ear MK.2", preco: 800, estoque: "8", id_categoria: 4 },
            { nome: "Titanium Bones", preco: 2000, estoque: "6", id_categoria: 5 },
            { nome: "Monowire", preco: 1800, estoque: "7", id_categoria: 2 },
            { nome: "Subdermal Armor", preco: 1500, estoque: "9", id_categoria: 5 },
        ]
    })
    console.log("cyberwares criados")
}
 
seedCyberwares()
    .catch((e) => { console.error(e) })
    .finally(async () => { await prisma.$disconnect() })
 