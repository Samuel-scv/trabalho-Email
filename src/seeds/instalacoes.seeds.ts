import { prisma } from "../../lib/prisma.js"
 
async function seedInstalacoes() {
    const instalacoes = [
        { id_cliente: 1, id_cyber: 1 },
        { id_cliente: 2, id_cyber: 2 },
        { id_cliente: 3, id_cyber: 4 },
        { id_cliente: 4, id_cyber: 5 },
        { id_cliente: 5, id_cyber: 7 },
    ]
 
    for (const item of instalacoes) {
        const cliente = await prisma.clientes.findUnique({ where: { id: item.id_cliente } })
        const cyber = await prisma.cyberwares.findUnique({ where: { id: item.id_cyber } })
 
        if (!cliente || !cyber) continue
 
        if (Number(cliente.saldo) < Number(cyber.preco)) {
            console.log(`⚠️ cliente ${cliente.nome} sem saldo para ${cyber.nome}`)
            continue
        }
 
        await prisma.$transaction(async (tx) => {
            await tx.instalacoes.create({
                data: { id_cliente: item.id_cliente, id_cyber: item.id_cyber }
            })
 
            await tx.clientes.update({
                where: { id: item.id_cliente },
                data: { saldo: Number(cliente.saldo) - Number(cyber.preco) }
            })
 
            await tx.cyberwares.update({
                where: { id: item.id_cyber },
                data: { estoque: String(Number(cyber.estoque) - 1) }
            })
 
            await tx.historicoVendas.create({
                data: {
                    nome_cliente: cliente.nome,
                    email_cliente: cliente.email,
                    nome_cyberware: cyber.nome,
                    valor_pago: cyber.preco
                }
            })
        })
 
        console.log(`✅ ${cliente.nome} instalou ${cyber.nome}`)
    }
 
    console.log("instalações criadas")
}
 
seedInstalacoes()
    .catch((e) => { console.error(e) })
    .finally(async () => { await prisma.$disconnect() })
 