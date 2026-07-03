import { execSync } from "node:child_process"

const seeds = [
    "prisma/seeds/categoria.seeds.ts",
    "prisma/seeds/clientes.seeds.ts",
    "prisma/seeds/cyberwares.seeds.ts",
    "prisma/seeds/instalacoes.seeds.ts",
]

for (const seed of seeds) {
    console.log(`Rodando ${seed}...`)
    execSync(`npx tsx ${seed}`, { stdio: "inherit" })
}

console.log("Todas as seeds foram executadas com sucesso!")