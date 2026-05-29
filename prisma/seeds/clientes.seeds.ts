import { prisma } from "../../lib/prisma.js"
 
async function seedClientes() {
    await prisma.clientes.createMany({
        data: [
            { nome: "Johnny Silverhand", email: "johnny@night.city", saldo: 5000 },
            { nome: "V Corpo", email: "v@night.city", saldo: 3500 },
            { nome: "Rogue Amendiares", email: "rogue@afterlife.net", saldo: 8000 },
            { nome: "Jackie Welles", email: "jackie@welles.com", saldo: 2000 },
            { nome: "Judy Alvarez", email: "judy@braindance.net", saldo: 4500 },
        ]
    })
    console.log("clientes criados")
}
 
seedClientes()
    .catch((e) => { console.error(e) })
    .finally(async () => { await prisma.$disconnect() })
 